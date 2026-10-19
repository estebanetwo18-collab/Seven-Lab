// Curvas y utilidades de animación compartidas entre la landing (Framer Motion)
// y el video (Remotion). Todo es una función pura del tiempo `t` en segundos,
// así el mismo componente se ve idéntico en el navegador y en el render.

export const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** expo-out: arranca rápido y se asienta suave (equivale a cubic-bezier(0.16, 1, 0.3, 1)). */
export const expoOut = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

export const expoInOut = (p: number) => {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2;
};

export const expoIn = (p: number) => (p <= 0 ? 0 : Math.pow(2, 10 * p - 10));

/** back-out: overshoot leve, para tarjetas que entran desde fuera de cuadro. */
export const backOut = (p: number, s = 1.3) => {
  const x = p - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};

/** Progreso 0→1 de un tramo que empieza en `start` y dura `dur` segundos. */
export const prog = (t: number, start: number, dur: number, ease: (p: number) => number = expoOut) =>
  ease(clamp01((t - start) / dur));

/** Resorte amortiguado (forma cerrada). Devuelve ~0→1 con un rebote suave. */
export const spring = (t: number, stiffness = 170, damping = 18, mass = 1) => {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
};

const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const mixColor = (a: string, b: string, p: number) => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const c = ca.map((v, i) => Math.round(lerp(v, cb[i], clamp01(p))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** Tiempo "infinito": estado final, usado con prefers-reduced-motion. */
export const T_FINAL = 1e6;
