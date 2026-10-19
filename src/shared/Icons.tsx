import type { CSSProperties } from 'react';
import type { IconName } from './tokens';

// Íconos de línea (trazo 1.6) dibujados a mano para no depender de librerías.
const PATHS: Record<IconName, JSX.Element> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 18.6z" />
      <path d="M9.2 8.6c.2-.5.6-.5.9-.5.3 0 .5.4.8 1.1.2.5-.5.9-.5 1.2.3.9 1.6 2.2 2.6 2.6.3 0 .7-.7 1.2-.5.7.3 1.1.5 1.1.8 0 .3 0 .7-.5.9-1.5.8-3.5-.2-4.9-1.7-1.4-1.4-2.3-3.1-.7-3.9z" />
    </>
  ),
  google: (
    <>
      <path d="M20 12.2c0 4.6-3.2 7.8-7.9 7.8a8 8 0 1 1 5.3-14" />
      <path d="M12.3 12.2H20" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8.5 14.5l2 2 4-4" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M8 12h8" />
      <rect x="4.5" y="7.5" width="3.5" height="9" rx="1.2" />
      <rect x="16" y="7.5" width="3.5" height="9" rx="1.2" />
      <path d="M2.5 10v4M21.5 10v4" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  megaphone: (
    <>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l8 4.5V4.5L7 9H5a1 1 0 0 0-1 1z" />
      <path d="M7 15l1.3 4.5h2.4L9.6 15.6" />
      <path d="M18.5 9.5a3.5 3.5 0 0 1 0 5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 16v-4M12 16V8M17 16v-7" />
      <path d="M6 9l5-4 3 2.5L19 4" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="3" />
      <path d="M16 10.5l5-3v9l-5-3" />
    </>
  ),
  browser: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M3 9h18" />
      <circle cx="6.3" cy="6.8" r=".5" fill="currentColor" />
      <circle cx="8.3" cy="6.8" r=".5" fill="currentColor" />
      <path d="M7 13h6M7 16h10" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="16.8" cy="9.5" r="2.5" />
      <path d="M16 14.6c2.4-.2 4 1.3 4.5 4" />
    </>
  ),
  spark: <path d="M12 3l2 6.5L20.5 12 14 14l-2 7-2-7-6.5-2L10 9.5z" />,
};

export function Icon({ name, size = 24, style, strokeWidth = 1.6 }: { name: IconName; size?: number; style?: CSSProperties; strokeWidth?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Cursor de flecha (negro con borde blanco), como el de la referencia. */
export function CursorArrow({ size = 34, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path
        d="M5 3l14 8.2-6.2 1.3 3.6 6.7-2.6 1.4-3.6-6.7L5.5 18z"
        fill="#0A0A0A"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Check que se dibuja con stroke-dashoffset. `p` va de 0 a 1. */
export function CheckDraw({ p, size = 40, color = '#4FC08D', bg = true }: { p: number; size?: number; color?: string; bg?: boolean }) {
  const len = 20;
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 40 40">
      {bg && <circle cx="20" cy="20" r="18" fill={color} opacity={Math.min(1, p * 3)} />}
      <path
        d="M12 20.5l5.5 5.5L28.5 14"
        fill="none"
        stroke={bg ? '#fff' : color}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len + 4}
        strokeDashoffset={(len + 4) * (1 - p)}
      />
    </svg>
  );
}
