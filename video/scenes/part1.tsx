import { AbsoluteFill } from 'remotion';
import { C, PHOTO } from '../../src/shared/tokens';
import { clamp01, expoInOut, expoOut, lerp, prog, backOut } from '../../src/shared/motion';
import { DrawLine, WordReveal, CharReveal, Counter } from '../../src/shared/Text';
import { PostCard } from '../../src/shared/Mockups';
import { Bg, BigWord, Center, PhotoPlane, Sheen, src, useLayout, useT } from '../kit';

const phrase = (V: boolean) => ({ fontSize: V ? 54 : 44, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.25 });

// 1 · 0–3 s · Negro con brillo diagonal
export function Intro() {
  const t = useT();
  const { V } = useLayout();
  return (
    <Bg color={C.black}>
      <Sheen t={t} />
      <Center>
        <WordReveal text="Hola, somos BOLD Agency" t={t} start={0.15} out={1.38} style={phrase(V)} />
      </Center>
      <Center>
        <WordReveal
          text={V ? 'Tu socio estratégico\nde crecimiento' : 'Tu socio estratégico de crecimiento'}
          t={t}
          start={1.68}
          out={2.72}
          outDur={0.26}
          style={phrase(V)}
        />
      </Center>
    </Bg>
  );
}

// 2 · 3–4 s · Frase + línea que se dibuja desde el centro
export function Propuesta() {
  const t = useT();
  const { V } = useLayout();
  return (
    <Bg color={C.black}>
      <Sheen t={t + 3} />
      <Center>
        <WordReveal text="Una propuesta para SevenLab" t={t} start={0.02} stagger={0.07} dur={0.5} out={0.62} outDur={0.3} style={phrase(V)} />
      </Center>
      <Center>
        <DrawLine t={t} start={0.4} dur={0.45} thickness={2} width="100%" />
      </Center>
    </Bg>
  );
}

// 3 · 4–6 s · La línea se abre en una franja blanca y luego deja ver la fachada
export function Franja() {
  const t = useT();
  const { V, H, W } = useLayout();
  const open = prog(t, 0, 0.45);
  const full = prog(t, 1.3, 0.6, expoInOut);
  const bandH = lerp(2, V ? 430 : 250, open);
  const h = lerp(bandH, H, full);
  const top = (H - h) / 2;
  const card = V ? { x: 160, y: 470, w: 760, h: 909 } : { x: (W - 540) / 2, y: (H - 646) / 2, w: 540, h: 646 };
  return (
    <Bg color={C.black}>
      <div style={{ position: 'absolute', left: 0, right: 0, top, height: h, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: -top, width: W, height: H }}>
          <PhotoPlane photo={PHOTO.fachada} t={Math.max(0, t - 1.1)} dur={0.9} card={card} dim={0.5} />
          <AbsoluteFill style={{ background: C.white, opacity: 1 - full }} />
          <Center>
            <WordReveal
              text={V ? 'Fuerza. Comunidad.\nFisio. Lagunilla.' : 'Fuerza. Comunidad. Fisio. Lagunilla.'}
              t={t}
              start={0.22}
              stagger={0.1}
              from="#A9C3D6"
              to={C.ink}
              out={1.15}
              outDur={0.25}
              style={phrase(V)}
            />
          </Center>
          <div style={{ position: 'absolute', left: V ? 80 : 96, bottom: V ? 140 : 72 }}>
            <WordReveal
              text="SevenLab · Lagunilla, Heredia"
              t={t}
              start={1.55}
              stagger={0.06}
              from="#5b5b5b"
              style={{ fontSize: V ? 34 : 26, fontWeight: 500 }}
            />
          </div>
        </div>
      </div>
    </Bg>
  );
}

// 4 · 6–9 s · Montaje de fotos del box, una palabra por plano (cortes de 0,5 s)
type Plane = { kind: 'photo'; photo: string; word?: string; side: 'left' | 'right' | 'center' } | { kind: 'stack' } | { kind: 'post' };

const PLANES: Plane[] = [
  { kind: 'photo', photo: PHOTO.levantamiento, word: 'Fuerza', side: 'right' },
  { kind: 'photo', photo: PHOTO.banca, word: 'Técnica', side: 'left' },
  { kind: 'stack' },
  { kind: 'photo', photo: PHOTO.equipo, word: 'Comunidad', side: 'center' },
  { kind: 'post' },
  { kind: 'photo', photo: PHOTO.concentracion, word: 'Pasión', side: 'left' },
];

export function Montaje() {
  const t = useT();
  const { V, W, H } = useLayout();
  const idx = Math.min(PLANES.length - 1, Math.floor(t / 0.5));
  const lt = t - idx * 0.5;
  const plane = PLANES[idx];

  if (plane.kind === 'stack') {
    const cards = [PHOTO.anillas, PHOTO.concentracion, PHOTO.levantamiento];
    const rots = [-9, 3, 11];
    const offs = V ? [-230, 0, 230] : [-420, 0, 420];
    return (
      <Bg color={C.sky1}>
        {cards.map((p, k) => {
          const e = backOut(clamp01((lt - k * 0.05) / 0.42), 1.1);
          const y = lerp(H * (0.75 + k * 0.12), 0, e);
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${offs[k]}px, ${y + (k - 1) * 30 - lt * (20 + k * 18)}px) rotate(${rots[k] + lt * (k - 1) * 4}deg)`,
                zIndex: k === 1 ? 3 : 1,
              }}
            >
              <PostCard src={src(p)} size={V ? 24 : 21} />
            </div>
          );
        })}
      </Bg>
    );
  }

  if (plane.kind === 'post') {
    const z = lerp(0.9, 1.05, expoOut(lt / 0.5));
    return (
      <Bg color={C.white}>
        <Center>
          <div style={{ transform: `scale(${z}) rotate(${lerp(-5, -2, lt / 0.5)}deg)` }}>
            <PostCard src={src(PHOTO.anillas)} size={V ? 38 : 25} caption="Cómo es entrenar en SevenLab" />
          </div>
        </Center>
      </Bg>
    );
  }

  const cw = V ? 780 : 600;
  const ch = V ? 975 : 750;
  const card = V
    ? { x: (W - cw) / 2, y: 300, w: cw, h: ch }
    : {
        x: plane.side === 'right' ? 1140 : plane.side === 'left' ? 180 : (W - cw) / 2,
        y: (H - ch) / 2,
        w: cw,
        h: ch,
      };
  const wordStyle = V
    ? { left: 0, right: 0, textAlign: 'center' as const, top: 1350 }
    : plane.side === 'right'
      ? { left: 170, top: 455 }
      : plane.side === 'left'
        ? { left: 900, top: 455 }
        : { left: 0, right: 0, textAlign: 'center' as const, top: 760, textShadow: '0 10px 40px rgba(0,0,0,.45)' };
  return (
    <>
      <PhotoPlane photo={plane.photo} t={lt} dur={0.5} card={card} />
      {plane.word && <BigWord text={plane.word} t={lt} size={V ? 150 : plane.side === 'center' ? 190 : 170} style={wordStyle} />}
    </>
  );
}

// 5 · 9–11 s · Negro, frase
export function Adentro() {
  const t = useT();
  const { V } = useLayout();
  return (
    <Bg color={C.black}>
      <Sheen t={t + 9} />
      <Center>
        <WordReveal
          text={V ? 'Lo que tienen adentro\nes mejor de lo que se ve\ndesde afuera.' : 'Lo que tienen adentro es mejor\nde lo que se ve desde afuera.'}
          t={t}
          start={0.1}
          stagger={0.075}
          out={1.72}
          outDur={0.26}
          style={{ ...phrase(V), fontSize: V ? 58 : 50 }}
        />
      </Center>
    </Bg>
  );
}

// 6 · 11–13 s · Blanco, cifras grandes
function Stat({ t, value, count, label, V }: { t: number; value: number; count: boolean; label: string; V: boolean }) {
  const outP = prog(t, 0.88, 0.22);
  return (
    <Center
      style={{
        flexDirection: V ? 'column' : 'row',
        gap: V ? 10 : 44,
        opacity: 1 - outP,
        filter: outP > 0 ? `blur(${outP * 8}px)` : undefined,
        transform: `translateY(${-outP * 40}px)`,
      }}
    >
      <div style={{ fontSize: V ? 380 : 340, fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9, color: C.ink }}>
        {count ? (
          <span style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.05em', minWidth: '1.12em', textAlign: V ? 'center' : 'right' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - prog(t, 0, 0.5)) * 100}%)` }}>
              <Counter to={value} t={t} start={0.02} dur={0.75} />
            </span>
          </span>
        ) : (
          <CharReveal text={String(value)} t={t} start={0} dur={0.55} />
        )}
      </div>
      <div style={{ textAlign: V ? 'center' : 'left' }}>
        <WordReveal text={label} t={t} start={0.18} stagger={0.08} from="#C5CDC9" to={C.ink} style={{ fontSize: V ? 64 : 58, fontWeight: 600, letterSpacing: '-0.02em' }} />
        <DrawLine t={t} start={0.4} dur={0.45} color={C.mint} thickness={4} width={V ? 520 : 440} style={{ marginTop: 18, transformOrigin: V ? 'center' : 'left', marginInline: V ? 'auto' : 0 }} />
      </div>
    </Center>
  );
}

export function Cifras() {
  const t = useT();
  const { V } = useLayout();
  return (
    <Bg color={C.white}>
      {t < 1 ? (
        <Stat t={t} value={1} count={false} label="reseña en Google" V={V} />
      ) : (
        <Stat t={t - 1} value={11} count label={V ? 'semanas sin publicar' : 'semanas sin publicar'} V={V} />
      )}
    </Bg>
  );
}

// 7 · 13–16 s · Lista gigante en rodillo
const LISTA = [
  'Presencia digital',
  '10 contenidos al mes',
  'Asistente de WhatsApp con IA',
  'Promociones que venden',
  'Comunidad que se queda',
  'Reporte mensual',
  'Landing page de regalo',
];

export function Lista() {
  const t = useT();
  const { V, H } = useLayout();
  const fs = V ? 64 : 118;
  const lh = fs * 1.24;
  let k = -3;
  for (let i = 0; i < 9; i++) k += prog(t, 0.04 + i * 0.29, 0.55);
  const cy = H / 2;
  return (
    <Bg color={C.black}>
      {LISTA.map((item, i) => {
        const y = cy + (i - k) * lh - lh / 2;
        const d = (y + lh / 2 - cy) / (H / 2);
        const fade = clamp01((Math.abs(d) - 0.38) / 0.42);
        const last = i === LISTA.length - 1;
        return (
          <div
            key={item}
            style={{
              position: 'absolute',
              left: V ? 64 : 110,
              right: V ? 40 : undefined,
              top: y,
              height: lh,
              fontSize: fs,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: `${lh}px`,
              whiteSpace: 'nowrap',
              color: last ? C.mint : C.white,
              opacity: 1 - fade,
              filter: fade > 0.01 ? `blur(${fade * 10}px)` : undefined,
            }}
          >
            {item}
          </div>
        );
      })}
    </Bg>
  );
}
