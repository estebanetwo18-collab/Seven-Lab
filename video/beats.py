"""Detecta los beats de assets/music.mp3 y los guarda en video/beats.json.

Uso:  pip install librosa  &&  python video/beats.py [ruta/al/audio.mp3]

Además copia la música a public/music.mp3 para que Remotion la use. Con
beats en el JSON, video/timeline.ts ajusta cada corte al beat más cercano
(±0,15 s) y el video incluye el audio automáticamente.
"""
import json
import shutil
import sys
from pathlib import Path

import librosa

root = Path(__file__).resolve().parent.parent
src = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "assets" / "music.mp3"
if not src.exists():
    sys.exit(f"No existe {src}: el video queda sin audio.")

y, sr = librosa.load(src, sr=None, mono=True, duration=36)
tempo, frames = librosa.beat.beat_track(y=y, sr=sr)
beats = [round(float(t), 3) for t in librosa.frames_to_time(frames, sr=sr)]
bpm = float(tempo[0] if hasattr(tempo, "__len__") else tempo)

(root / "video" / "beats.json").write_text(json.dumps({"source": src.name, "bpm": round(bpm, 1), "beats": beats}, indent=2))
shutil.copy(src, root / "public" / "music.mp3")
print(f"{len(beats)} beats · {bpm:.0f} BPM → video/beats.json")
print("Ahora: npm run video:render y poné VIDEO_HAS_AUDIO = true en src/landing/videoConfig.ts")
