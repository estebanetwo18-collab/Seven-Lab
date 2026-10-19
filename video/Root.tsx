import { useEffect, useState } from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import '../src/shared/fonts';
import { DURATION, FPS, SevenLabPitch } from './SevenLabPitch';

// Espera a que Manrope (y el glifo "₡") estén listos antes de renderizar.
const FontGate = () => {
  const [handle] = useState(() => delayRender('Cargando tipografías'));
  useEffect(() => {
    const weights = ['400', '500', '600', '700', '800'];
    Promise.all(weights.map((w) => document.fonts.load(`${w} 40px Manrope`, 'Aa₡×')))
      .then(() => Promise.all(['400', '700'].map((w) => document.fonts.load(`${w} 40px ColonSign`, '₡'))))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
  return <SevenLabPitch />;
};

export const RemotionRoot = () => (
  <>
    <Composition id="SevenLabPitch" component={FontGate} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Composition id="SevenLabPitchVertical" component={FontGate} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
  </>
);
