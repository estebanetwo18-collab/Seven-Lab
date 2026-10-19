import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../src/shared/tokens';
import { lerp, prog } from '../src/shared/motion';

/** Tiempo local de la escena, en segundos. */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Orientación + factor de escala para reutilizar cada escena en 16:9 y 9:16. */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const V = height > width;
  return { V, W: width, H: height };
};

export const src = (p: string) => staticFile(p);

export function Bg({ color, children, style }: { color: string; children?: ReactNode; style?: CSSProperties }) {
  return <AbsoluteFill style={{ background: color, overflow: 'hidden', ...style }}>{children}</AbsoluteFill>;
}

/** Brillo diagonal muy sutil que se desplaza sobre el negro (0–3 s de la referencia). */
export function Sheen({ t, strength = 1 }: { t: number; strength?: number }) {
  const x = -30 + ((t * 9) % 160);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(118deg, transparent ${x}%, rgba(255,255,255,${0.055 * strength}) ${x + 12}%, transparent ${x + 24}%, transparent ${x + 34}%, rgba(255,255,255,${0.035 * strength}) ${x + 44}%, transparent ${x + 56}%)`,
      }}
    />
  );
}

export function Center({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...style }}>{children}</AbsoluteFill>
  );
}

/**
 * Plano de foto: la foto de Instagram (~800 px) no se estira a pantalla
 * completa: se usa desenfocada y oscurecida de fondo, y nítida en una tarjeta.
 */
export function PhotoPlane({
  photo,
  t,
  dur,
  card,
  dim = 0.45,
}: {
  photo: string;
  t: number;
  dur: number;
  card: { x: number; y: number; w: number; h: number; rot?: number; pos?: string };
  dim?: number;
}) {
  const z = lerp(1, 1.06, t / dur);
  const pan = lerp(-10, 10, t / dur);
  const enter = prog(t, 0, 0.4);
  return (
    <AbsoluteFill style={{ background: C.black, overflow: 'hidden' }}>
      <Img
        src={src(photo)}
        style={{
          position: 'absolute',
          inset: -60,
          width: 'calc(100% + 120px)',
          height: 'calc(100% + 120px)',
          objectFit: 'cover',
          filter: 'blur(28px) saturate(1.1)',
          transform: `scale(${z * 1.05}) translateX(${pan}px)`,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(10,10,10,${dim})` }} />
      <div
        style={{
          position: 'absolute',
          left: card.x,
          top: card.y,
          width: card.w,
          height: card.h,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 40px 90px -30px rgba(0,0,0,.65)',
          transform: `scale(${lerp(1.04, 1, enter) * z}) rotate(${card.rot ?? 0}deg) translateX(${-pan * 0.6}px)`,
        }}
      >
        <Img src={src(photo)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: card.pos ?? '50% 40%' }} />
      </div>
    </AbsoluteFill>
  );
}

/** Palabra gigante de los montajes (revelado por máscara, rápido). */
export function BigWord({ text, t, size, style }: { text: string; t: number; size: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        fontSize: size,
        fontWeight: 800,
        letterSpacing: '-0.045em',
        color: C.white,
        lineHeight: 1,
        ...style,
      }}
    >
      {Array.from(text).map((ch, i) => {
        const p = prog(t, 0.03 + i * 0.022, 0.42);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)` }}>{ch}</span>
          </span>
        );
      })}
    </div>
  );
}
