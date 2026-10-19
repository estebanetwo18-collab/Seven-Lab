import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { C } from '../shared/tokens';
import { WordReveal } from '../shared/Text';
import { useClock, asset } from './hooks';
import { VIDEO_HAS_AUDIO } from './videoConfig';

const VERTICAL_MQ = '(max-aspect-ratio: 4/5)';

export function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vertical, setVertical] = useState(() => typeof window !== 'undefined' && window.matchMedia(VERTICAL_MQ).matches);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ref, t] = useClock<HTMLDivElement>(4, 0.1);

  useEffect(() => {
    const mq = window.matchMedia(VERTICAL_MQ);
    const on = () => setVertical(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // El video se pide después de que la página terminó de cargar: el póster
  // aparece al instante y el video no compite con lo primero que se ve.
  useEffect(() => {
    const go = () => setReady(true);
    if (document.readyState === 'complete') {
      const id = setTimeout(go, 300);
      return () => clearTimeout(id);
    }
    window.addEventListener('load', go, { once: true });
    return () => window.removeEventListener('load', go);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ready) return;
    v.load();
    if (!reduce) v.play().catch(() => setPlaying(false));
  }, [ready, vertical, reduce]);

  const name = vertical ? 'sevenlab-pitch-vertical' : 'sevenlab-pitch';
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <header className="relative bg-night text-white">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 text-sm sm:px-8">
        <span className="font-bold tracking-tight">
          BOLD <span className="font-normal">Agency</span>
        </span>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">Propuesta privada</span>
      </div>

      <div className="relative mx-auto w-full max-w-[1920px]">
        <video
          ref={videoRef}
          className="block h-[86svh] w-full bg-night object-cover sm:h-auto sm:max-h-[100svh] sm:aspect-video"
          style={vertical ? { aspectRatio: '9 / 16', height: 'auto', maxHeight: '86svh' } : undefined}
          poster={asset(`video/${vertical ? 'poster-vertical' : 'poster'}.jpg`)}
          muted={muted}
          loop
          playsInline
          autoPlay={!reduce}
          preload="none"
          aria-label="Video de presentación: BOLD Agency × SevenLab"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {ready && <source src={asset(`video/${name}.mp4`)} type="video/mp4" />}
        </video>

        <div className="absolute bottom-4 right-4 flex gap-2 sm:bottom-6 sm:right-6">
          <button
            type="button"
            onClick={toggle}
            className="rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
          >
            {playing ? 'Pausar video' : 'Ver video'}
          </button>
          {VIDEO_HAS_AUDIO && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={!muted}
              className="rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
            >
              {muted ? 'Activar sonido' : 'Silenciar'}
            </button>
          )}
        </div>
      </div>

      <div ref={ref} className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:pb-28">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-mint">SevenLab — Propuesta estratégica</p>
          <WordReveal
            as="h1"
            text="Marketing + crecimiento comercial"
            t={t}
            start={0.05}
            stagger={0.07}
            to={C.white}
            className="text-[2.6rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
          />
        </div>
        <div>
          <WordReveal
            text="Un equipo estratégico para ordenar, comunicar, vender y hacer crecer la marca"
            t={t}
            start={0.4}
            stagger={0.03}
            from="#4a4f4d"
            to="#D5DBD8"
            className="text-lg leading-relaxed sm:text-xl"
          />
          <p className="mt-6 text-sm text-white/70" style={{ opacity: Math.min(1, Math.max(0, (t - 0.9) / 0.6)) }}>
            BOLD Agency · Octubre 2026
          </p>
        </div>
      </div>
    </header>
  );
}
