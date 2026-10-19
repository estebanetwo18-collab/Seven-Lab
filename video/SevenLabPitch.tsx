import type { FC } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from 'remotion';
import { C, FONT } from '../src/shared/tokens';
import { ImgContext } from '../src/shared/ImgContext';
import { FPS, HAS_SOUNDTRACK, SCENES, SOUNDTRACK, type SceneId } from './timeline';
import { Adentro, Cifras, Franja, Intro, Lista, Montaje, Propuesta } from './scenes/part1';
import { Busqueda, Contenido, Entrena, Logo, Montaje2, Pilares, Precio, WhatsApp } from './scenes/part2';

const MAP: Record<SceneId, FC> = {
  intro: Intro,
  propuesta: Propuesta,
  franja: Franja,
  montaje: Montaje,
  adentro: Adentro,
  cifras: Cifras,
  lista: Lista,
  contenido: Contenido,
  whatsapp: WhatsApp,
  entrena: Entrena,
  montaje2: Montaje2,
  pilares: Pilares,
  precio: Precio,
  busqueda: Busqueda,
  logo: Logo,
};

// Remotion <Img> espera a que cada foto cargue antes de capturar el cuadro.
const RemotionImg = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <Img {...(props as { src: string })} />;

export const SevenLabPitch: FC = () => (
  <ImgContext.Provider value={RemotionImg}>
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: C.black,
        WebkitFontSmoothing: 'antialiased',
        fontFeatureSettings: '"ss01"',
      }}
    >
      {SCENES.map((s) => {
        const Scene = MAP[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
            <Scene />
          </Sequence>
        );
      })}
      {/* Música + voz en off + efectos (video/mezcla.py). */}
      {HAS_SOUNDTRACK && <Audio src={staticFile(SOUNDTRACK)} />}
    </AbsoluteFill>
  </ImgContext.Provider>
);

export const DURATION = SCENES[SCENES.length - 1].from + SCENES[SCENES.length - 1].frames;
export { FPS };
