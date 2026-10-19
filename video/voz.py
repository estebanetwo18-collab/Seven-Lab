"""Genera la voz en off frase por frase y la acomoda en el tiempo del video.

Lee assets/audio/voz/guion.tsv (id, inicio_s, duracion_max_s, velocidad, texto),
sintetiza cada frase con una voz neural de Costa Rica (Microsoft Edge TTS,
es-CR-JuanNeural), recorta silencios, la acelera hasta un 15 % si no entra en su
plano (atempo, sin cambiar el tono) y guarda colocacion.tsv con el inicio final.

Uso:  pip install edge-tts  &&  python video/voz.py [voz]
      (voz por defecto: es-CR-JuanNeural; alternativa: es-CR-MariaNeural)
Si estás detrás de un proxy con certificado propio: SSL_CERT_FILE=/ruta/ca.crt
"""
import asyncio
import os
import subprocess
import sys
from pathlib import Path

import certifi

if os.environ.get("SSL_CERT_FILE"):
    certifi.where = lambda: os.environ["SSL_CERT_FILE"]
import edge_tts  # noqa: E402

root = Path(__file__).resolve().parent.parent
d = root / "assets" / "audio" / "voz"
voice = sys.argv[1] if len(sys.argv) > 1 else "es-CR-JuanNeural"


def run(*args):
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", *args], check=True)


def dur(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(out.stdout)


async def main():
    prev_end = 0.0
    rows = []
    for line in (d / "guion.tsv").read_text().strip().splitlines():
        fid, at, maxd, rate, text = line.split("\t")
        at, maxd = float(at), float(maxd)
        raw = d / f"_raw_{fid}.mp3"
        await edge_tts.Communicate(text, voice, rate=rate, pitch="-2Hz").save(str(raw))
        trim = d / f"_trim_{fid}.wav"
        run("-i", str(raw), "-af",
            "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,"
            "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse",
            "-ar", "48000", "-ac", "1", str(trim))
        tempo = min(1.15, max(1.0, dur(trim) / maxd))
        run("-i", str(trim), "-af", f"atempo={tempo:.3f}", str(d / f"{fid}.wav"))
        raw.unlink(); trim.unlink()
        length = dur(d / f"{fid}.wav")
        start = max(at, prev_end + 0.12)
        prev_end = start + length
        rows.append(f"{fid}\t{start:.3f}")
        print(f"{fid}: {start:6.2f}s → {prev_end:6.2f}s  (x{tempo:.2f})  {text}")
    (d / "colocacion.tsv").write_text("\n".join(rows) + "\n")


asyncio.run(main())
