import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { T_FINAL } from '../shared/motion';

/**
 * Reloj de la sección: segundos desde que entra en pantalla. Alimenta los
 * mismos componentes del video (que son función de `t`). Con
 * prefers-reduced-motion devuelve directamente el estado final.
 */
export function useClock<T extends Element = HTMLDivElement>(maxT = 5, amount = 0.3) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setT(T_FINAL);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = (now - t0) / 1000;
      if (s >= maxT) return setT(T_FINAL);
      setT(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, maxT]);
  return [ref, t] as const;
}

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
