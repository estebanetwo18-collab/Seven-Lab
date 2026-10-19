import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../shared/tokens';
import { EASE_EXPO_OUT } from '../shared/motion';
import { DrawLine, WordReveal } from '../shared/Text';
import { useClock } from './hooks';

/** Encabezado de sección: eyebrow + título revelado palabra por palabra + línea. */
export function Heading({
  eyebrow,
  title,
  dark = false,
  center = false,
  as = 'h2',
}: {
  eyebrow?: string;
  title: string;
  dark?: boolean;
  center?: boolean;
  as?: 'h1' | 'h2';
}) {
  const [ref, t] = useClock(3);
  return (
    <div ref={ref} className={center ? 'text-center' : ''}>
      {eyebrow && (
        <p className={`mb-4 text-xs font-bold uppercase tracking-[0.22em] ${dark ? 'text-mint' : 'text-brand'}`}>{eyebrow}</p>
      )}
      <WordReveal
        as={as}
        text={title}
        t={t}
        stagger={0.06}
        from={dark ? '#5d6461' : '#C5CDC9'}
        to={dark ? C.white : C.ink}
        className="text-[2rem] font-bold leading-[1.08] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl"
      />
      <DrawLine
        t={t}
        start={0.35}
        dur={0.7}
        color={C.mint}
        thickness={3}
        width={72}
        style={{ marginTop: 24, transformOrigin: center ? 'center' : 'left', marginInline: center ? 'auto' : 0 }}
      />
    </div>
  );
}

/** Aparece flotando hacia arriba con expo-out al entrar en pantalla. */
export function Rise({ children, delay = 0, className = '', y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: EASE_EXPO_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  children,
  className = '',
  tone = 'light',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark' | 'paper' | 'sky' | 'forest';
}) {
  const bg = {
    light: 'bg-white text-ink',
    dark: 'bg-night text-white',
    paper: 'bg-paper text-ink',
    sky: 'bg-gradient-to-b from-sky1 to-[#D3E3EF] text-ink',
    forest: 'bg-forest text-white',
  }[tone];
  return (
    <section id={id} className={`${bg} px-4 py-20 sm:px-8 sm:py-28 lg:py-36 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Check({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`mt-[3px] h-5 w-5 flex-none ${className}`}>
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity=".16" />
      <path d="M6 10.3l2.6 2.6L14 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Cross({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`mt-[3px] h-5 w-5 flex-none ${className}`}>
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity=".14" />
      <path d="M7 7l6 6M13 7l-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CheckList({ items, tone = 'brand', delay = 0 }: { items: string[]; tone?: 'brand' | 'mint'; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <ul className="space-y-3.5">
      {items.map((x, i) => (
        <motion.li
          key={x}
          className="flex gap-3 text-[1.02rem] leading-relaxed"
          initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: delay + i * 0.06, ease: EASE_EXPO_OUT }}
        >
          <Check className={tone === 'mint' ? 'text-mint' : 'text-brand'} />
          <span>{x}</span>
        </motion.li>
      ))}
    </ul>
  );
}
