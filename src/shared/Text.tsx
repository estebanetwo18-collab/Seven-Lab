import type { CSSProperties, ElementType } from 'react';
import { C } from './tokens';
import { clamp01, expoOut, mixColor, prog } from './motion';

/** Texto solo para lectores de pantalla (el texto animado va en aria-hidden). */
export const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

type WordRevealProps = {
  text: string;
  /** Segundos desde que arranca la escena / la sección entra en pantalla. */
  t: number;
  start?: number;
  /** Retraso entre palabras (s). Medido en la referencia: ~0,08–0,12 s. */
  stagger?: number;
  dur?: number;
  from?: string;
  to?: string;
  blur?: number;
  y?: number;
  /** Momento en que toda la frase sale (fade + blur). */
  out?: number;
  outDur?: number;
  as?: ElementType;
  style?: CSSProperties;
  className?: string;
  /** Palabras (sin puntuación) que terminan en color de acento. */
  accent?: string[];
  accentColor?: string;
};

/**
 * Revelado palabra por palabra: opacidad 0→1, desenfoque 8px→0, y 10px→0 y
 * color gris→blanco. Es la firma tipográfica de la referencia.
 */
export function WordReveal({
  text,
  t,
  start = 0,
  stagger = 0.085,
  dur = 0.7,
  from = C.gray,
  to = C.white,
  blur = 8,
  y = 10,
  out,
  outDur = 0.35,
  as: Tag = 'p',
  style,
  className,
  accent,
  accentColor = C.mint,
}: WordRevealProps) {
  const lines = text.split('\n');
  let i = 0;
  const outP = out === undefined ? 0 : prog(t, out, outDur);
  return (
    <Tag
      className={className}
      style={{
        // Sin className (video) se anula el margen por defecto; en la landing lo resetea Tailwind.
        margin: className ? undefined : 0,
        opacity: 1 - outP,
        filter: outP > 0.001 ? `blur(${outP * 6}px)` : undefined,
        transform: outP > 0 ? `translateY(${-outP * 8}px)` : undefined,
        ...style,
      }}
    >
      <span style={SR_ONLY}>{text.replace(/\n/g, ' ')}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden style={{ display: 'block' }}>
          {line.split(' ').map((word, wi, arr) => {
            const ws = start + i++ * stagger;
            const local = (t - ws) / dur;
            const pFast = expoOut(clamp01(local * 1.8));
            const pColor = expoOut(clamp01(local));
            const clean = word.replace(/[.,:;!?¡¿"“”]/g, '');
            const target = accent?.includes(clean) ? accentColor : to;
            return (
              <span key={wi}>
                <span
                  style={{
                    display: 'inline-block',
                    opacity: pFast,
                    color: mixColor(from, target, pColor),
                    filter: pFast < 0.999 ? `blur(${(1 - pFast) * blur}px)` : undefined,
                    transform: `translateY(${(1 - pFast) * y}px)`,
                    willChange: pFast < 1 ? 'transform, filter, opacity' : undefined,
                  }}
                >
                  {word}
                </span>
                {wi < arr.length - 1 ? ' ' : null}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

type CharRevealProps = {
  text: string;
  t: number;
  start?: number;
  stagger?: number;
  dur?: number;
  as?: ElementType;
  style?: CSSProperties;
  className?: string;
  charStyle?: (index: number) => CSSProperties | undefined;
};

/** Revelado por máscara, letra por letra (logo y cifra del precio). */
export function CharReveal({
  text,
  t,
  start = 0,
  stagger = 0.035,
  dur = 0.7,
  as: Tag = 'span',
  style,
  className,
  charStyle,
}: CharRevealProps) {
  return (
    <Tag className={className} style={{ display: 'inline-block', whiteSpace: 'pre', ...style }}>
      <span style={SR_ONLY}>{text}</span>
      {Array.from(text).map((ch, i) => {
        const p = prog(t, start + i * stagger, dur);
        return (
          <span
            key={i}
            aria-hidden
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.06em', marginBottom: '-0.06em' }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 105}%)`,
                ...charStyle?.(i),
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

/** Línea fina que se dibuja desde el centro hacia los lados (scaleX). */
export function DrawLine({
  t,
  start = 0,
  dur = 0.4,
  color = C.white,
  thickness = 1,
  width = '100%',
  style,
}: {
  t: number;
  start?: number;
  dur?: number;
  color?: string;
  thickness?: number;
  width?: number | string;
  style?: CSSProperties;
}) {
  const p = prog(t, start, dur);
  return (
    <div
      aria-hidden
      style={{
        width,
        height: thickness,
        background: color,
        transform: `scaleX(${p})`,
        transformOrigin: 'center',
        ...style,
      }}
    />
  );
}

/** Contador que sube con expo-out. */
export function Counter({
  to,
  t,
  start = 0,
  dur = 1.1,
  from = 0,
  format = (n: number) => Math.round(n).toString(),
  style,
  className,
}: {
  to: number;
  t: number;
  start?: number;
  dur?: number;
  from?: number;
  format?: (n: number) => string;
  style?: CSSProperties;
  className?: string;
}) {
  const p = prog(t, start, dur);
  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {format(from + (to - from) * p)}
    </span>
  );
}
