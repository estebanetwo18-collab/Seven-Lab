import beatsFile from './beats.json';

// Guion (sección 3 del brief). Segundos de inicio de cada escena.
// Si existe música y video/beats.json trae beats, cada corte se ajusta al
// beat más cercano (±0,15 s) para que los cortes caigan en el golpe.
const NOMINAL = [
  ['intro', 0],
  ['propuesta', 3],
  ['franja', 4],
  ['montaje', 6],
  ['adentro', 9],
  ['cifras', 11],
  ['lista', 13],
  ['contenido', 16],
  ['whatsapp', 18],
  ['entrena', 21],
  ['montaje2', 23],
  ['pilares', 26],
  ['precio', 28],
  ['busqueda', 30],
  ['logo', 33],
] as const;

/**
 * Velocidad global de las animaciones. 1 = guion original (36 s);
 * 0,8 = todo un 20 % más lento (45 s). Cambia cortes y curvas por igual.
 */
export const SPEED = 0.8;
const NOMINAL_TOTAL = 36;
export const TOTAL_SECONDS = NOMINAL_TOTAL / SPEED;
export const FPS = 60;

const beats: number[] = (beatsFile as { beats: number[] }).beats ?? [];

const snap = (s: number) => {
  if (!beats.length || s === 0) return s;
  let best = s;
  let dist = 0.15;
  for (const b of beats) {
    if (Math.abs(b - s) < dist) {
      dist = Math.abs(b - s);
      best = b;
    }
  }
  return best;
};

export type SceneId = (typeof NOMINAL)[number][0];

export const SCENES = NOMINAL.map(([id, start], i) => {
  const from = Math.round(snap(start / SPEED) * FPS);
  const next = i < NOMINAL.length - 1 ? Math.round(snap(NOMINAL[i + 1][1] / SPEED) * FPS) : Math.round(TOTAL_SECONDS * FPS);
  return { id: id as SceneId, from, frames: next - from };
});

export const HAS_MUSIC = beats.length > 0;

/** Poné en true cuando exista public/voz.mp3 (voz en off de ElevenLabs). */
export const HAS_VOICE = false;
