"""Mezcla la banda sonora del video: música + voz en off + efectos.

- Música: "Motivating Mornings" (Mixkit, licencia gratuita de uso comercial),
  desde el segundo 4,44 para que el drop (entra el bombo) caiga en el corte al
  montaje de fotos (7,5 s del video).
- Voz: frases de assets/audio/voz/ colocadas según colocacion.tsv, con
  filtro pasa-altos, compresión y un poco de brillo.
- Ducking: la música baja ~12 dB mientras habla la voz y vuelve suave.
- Efectos (Mixkit): whoosh, pops, clics, tipeo, en los tiempos de SFX.
- Salida normalizada a -14 LUFS (estándar de redes) con pico máximo -1,5 dBTP.

Uso:  pip install numpy librosa  &&  python video/mezcla.py
Genera public/audio/banda-sonora.mp3, public/audio/voz.mp3 y video/beats.json.
"""
import json
import subprocess
from pathlib import Path

import numpy as np

root = Path(__file__).resolve().parent.parent
A = root / "assets" / "audio"
OUT = root / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

SR = 48000
TOTAL = 46.0            # duración del video (s)
MUSIC_OFFSET = 4.44     # segundo de la canción donde arranca el video
MUSIC_GAIN_DB = -3.0
DUCK_DB = -12.0
VOICE_GAIN_DB = 2.0
BRAND_WINDOWS = [(0.2, 2.2), (41.3, 43.0)]  # "Hola, somos BOLD Agency" y "BOLD Agency y SevenLab"

# (segundo del video, archivo, ganancia dB, recorte inicio s, duración s o None)
SFX = [
    (4.00, "mixkit-1491.mp3", -14, 0, None),   # línea que se dibuja
    (5.55, "mixkit-1492.mp3", -16, 0, None),   # la franja se abre a pantalla completa
    (14.85, "mixkit-2350.mp3", -20, 0.25, 0.6),  # cambio de cifra 1 → 11
    (22.67, "mixkit-2568.mp3", -22, 0, None),  # burbujas del chat
    (23.11, "mixkit-2568.mp3", -22, 0, None),
    (23.55, "mixkit-2568.mp3", -22, 0, None),
    (23.99, "mixkit-2568.mp3", -22, 0, None),
    (24.42, "mixkit-2568.mp3", -22, 0, None),
    (25.42, "mixkit-1119.mp3", -12, 0, None),  # clic en "Reservá tu clase"
    (25.51, "mixkit-2568.mp3", -14, 0, None),  # check
    (28.68, "mixkit-1491.mp3", -16, 0, None),  # entra el segundo montaje
    (39.75, "mixkit-2531.mp3", -16, 3.0, 0.8), # tipeo "BOLD × SevenLab"
    (40.80, "mixkit-1119.mp3", -12, 0, None),  # clic en la lupa
    (41.00, "mixkit-1491.mp3", -18, 0, None),  # entra el logo
]


def load(path, start=0.0, length=None):
    args = ["ffmpeg", "-nostdin", "-v", "error", "-ss", str(start), "-i", str(path)]
    if length:
        args += ["-t", str(length)]
    args += ["-f", "f32le", "-ac", "2", "-ar", str(SR), "-"]
    raw = subprocess.run(args, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def db(x):
    return 10 ** (x / 20)


def place(track, clip, at, gain=1.0):
    i = int(at * SR)
    n = min(len(clip), len(track) - i)
    if n > 0:
        track[i:i + n] += clip[:n] * gain


def fade(x, fin=0.0, fout=0.0):
    n = len(x)
    if fin:
        k = int(fin * SR)
        x[:k] *= np.linspace(0, 1, k)[:, None]
    if fout:
        k = int(fout * SR)
        x[n - k:] *= np.linspace(1, 0, k)[:, None]
    return x


N = int(TOTAL * SR)

# Voz
voice = np.zeros((N, 2), np.float32)
for line in (A / "voz" / "colocacion.tsv").read_text().strip().splitlines():
    fid, at = line.split("\t")
    place(voice, load(A / "voz" / f"{fid}.wav"), float(at))

tmp = OUT / "_voz.wav"
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                "-af", "highpass=f=90,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1.2:g=2.5,"
                       "acompressor=threshold=-20dB:ratio=3:attack=4:release=90:makeup=3,loudnorm=I=-16:TP=-2:LRA=7",
                "-ar", str(SR), str(tmp)], input=voice.tobytes(), check=True)
voice = load(tmp)[:N]
voice = np.pad(voice, ((0, N - len(voice)), (0, 0)))
tmp.unlink()

# Música con ducking
music = load(A / "musica" / "motivating-mornings_mixkit-33.mp3", MUSIC_OFFSET, TOTAL)
music = np.pad(music, ((0, max(0, N - len(music))), (0, 0)))[:N]
music = fade(music, fin=0.6, fout=2.8) * db(MUSIC_GAIN_DB)

env = np.abs(voice).max(axis=1)
hop = SR // 100
env = np.array([env[i:i + hop].max() for i in range(0, N, hop)])
active = (env > 0.02).astype(float)
smooth = np.zeros_like(active)
for i, a in enumerate(active):  # ataque rápido (30 ms), salida lenta (350 ms)
    prev = smooth[i - 1] if i else 0
    k = 0.33 if a > prev else 0.028
    smooth[i] = prev + (a - prev) * k
gain = 1 + (db(DUCK_DB) - 1) * np.repeat(smooth, hop)[:N]
# Donde se dice la marca ("BOLD Agency"), la música baja 6 dB más para que se entienda.
for a, b in BRAND_WINDOWS:
    w = np.ones(N)
    i0, i1 = int(a * SR), int(b * SR)
    ramp = int(0.25 * SR)
    w[i0:i1] = db(-6)
    r0 = min(ramp, i0)
    w[i0 - r0:i0] = np.linspace(1, db(-6), r0)
    w[i1:i1 + ramp] = np.linspace(db(-6), 1, ramp)
    gain *= w
music *= gain[:, None]

# Efectos
sfx = np.zeros((N, 2), np.float32)
for at, f, g, ss, ln in SFX:
    place(sfx, fade(load(A / "sfx" / f, ss, ln), 0.005, 0.04), at, db(g))

mix = music + voice * db(VOICE_GAIN_DB) + sfx
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", "48000", "-b:a", "192k", str(OUT / "banda-sonora.mp3")],
               input=mix.astype(np.float32).tobytes(), check=True)
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                "-b:a", "160k", str(OUT / "voz.mp3")], input=voice.tobytes(), check=True)

# Beats de la música (en tiempo del video) para ajustar cortes
try:
    import librosa

    y, sr = librosa.load(str(A / "musica" / "motivating-mornings_mixkit-33.mp3"), sr=22050, offset=MUSIC_OFFSET, duration=TOTAL)
    tempo, frames = librosa.beat.beat_track(y=y, sr=sr)
    beats = [round(float(t), 3) for t in librosa.frames_to_time(frames, sr=sr)]
    bpm = round(float(np.atleast_1d(tempo)[0]), 1)
    (root / "video" / "beats.json").write_text(json.dumps(
        {"source": "Motivating Mornings (Mixkit) desde 4,44 s", "bpm": bpm, "beats": beats}, indent=2))
    print(f"{len(beats)} beats · {bpm} BPM → video/beats.json")
except ImportError:
    print("librosa no está instalado: video/beats.json no se actualizó")

print("→ public/audio/banda-sonora.mp3 y public/audio/voz.mp3")
