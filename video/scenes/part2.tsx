import { AbsoluteFill, Img } from 'remotion';
import { C, CREDITOS, PHOTO, PRECIO, PRECIO_DETALLE, type IconName } from '../../src/shared/tokens';
import { backOut, clamp01, expoInOut, expoOut, lerp, prog, spring } from '../../src/shared/motion';
import { CharReveal, WordReveal } from '../../src/shared/Text';
import { BrowserMock, Logotype, PackageCard, PhoneChat, PostCard } from '../../src/shared/Mockups';
import { CheckDraw, CursorArrow, Icon } from '../../src/shared/Icons';
import { Bg, Center, PhotoPlane, Sheen, src, useLayout, useT } from '../kit';

// 8 · 16–18 s · Celeste con publicaciones flotando
export function Contenido() {
  const t = useT();
  const { V, W, H } = useLayout();
  const photos = [PHOTO.levantamiento, PHOTO.anillas, PHOTO.banca, PHOTO.equipo, PHOTO.concentracion, PHOTO.fachada];
  const pos = V
    ? [
        [230, 360, -12],
        [850, 330, 10],
        [540, 110, 4],
        [210, 1580, 9],
        [870, 1600, -8],
        [540, 1840, -4],
      ]
    : [
        [290, 270, -12],
        [760, 150, 6],
        [1650, 260, 12],
        [470, 840, 9],
        [1430, 850, -8],
        [1110, 990, -5],
      ];
  return (
    <Bg color={C.sky1}>
      {photos.map((p, i) => {
        const [x, y, r] = pos[i];
        const e = backOut(clamp01((t - i * 0.05) / 0.7), 1.2);
        const fx = x + (x - W / 2) * 0.9;
        const fy = y + (y - H / 2) * 1.3;
        const drift = Math.sin(t * 1.4 + i) * 8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: lerp(fx, x, e),
              top: lerp(fy, y, e) + drift,
              transform: `translate(-50%, -50%) rotate(${lerp(r * 2.2, r, e)}deg)`,
            }}
          >
            <PostCard src={src(p)} size={V ? 14 : 12} />
          </div>
        );
      })}
      <Center>
        <WordReveal text="Contenido que se ve" t={t} start={0.12} out={0.95} outDur={0.22} from="#9DB7CB" to={C.ink} style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-0.025em' }} />
      </Center>
      <Center>
        <WordReveal
          text={V ? 'conversaciones\nque se convierten' : 'conversaciones que se convierten'}
          t={t}
          start={1.05}
          from="#9DB7CB"
          to={C.ink}
          style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15 }}
        />
      </Center>
    </Bg>
  );
}

// 9 · 18–21 s · Teléfono con el chat de WhatsApp + reserva
export function WhatsApp() {
  const t = useT();
  const { V, W, H } = useLayout();
  const ps = V ? 21 : 22;
  const phoneW = 19.5 * ps;
  const phoneH = 38 * ps;
  const enter = spring(t, 140, 18);
  const phone = V ? { x: (W - phoneW) / 2, y: 200 } : { x: 450, y: (H - phoneH) / 2 };
  const cardW = V ? 760 : 520;
  const card = V ? { x: (W - cardW) / 2, y: 1110 } : { x: 1010, y: 470 };
  const cardIn = spring(t - 1.7, 170, 17);
  const btn = { x: card.x + cardW - (V ? 200 : 170), y: card.y + (V ? 262 : 230) };
  const cur = prog(t, 2.0, 0.45);
  const curX = lerp(W + 40, btn.x + 30, cur);
  const curY = lerp(H + 40, btn.y + 14, cur);
  const click = t > 2.45 && t < 2.65 ? 1 - Math.sin(((t - 2.45) / 0.2) * Math.PI) * 0.1 : 1;
  const check = prog(t, 2.52, 0.4);
  return (
    <Bg color={C.white}>
      <div style={{ position: 'absolute', left: phone.x, top: phone.y + (1 - enter) * 80, opacity: clamp01(t / 0.15) }}>
        <PhoneChat t={t} times={[0.25, 0.6, 0.95, 1.3, 1.65]} size={ps} />
      </div>
      <div style={{ position: 'absolute', left: card.x, top: V ? 1040 : 360, width: cardW, textAlign: V ? 'center' : 'left' }}>
        <WordReveal text="Asistente de WhatsApp con IA" t={t} start={0.15} stagger={0.06} from="#C5CDC9" to={C.ink} style={{ fontSize: V ? 40 : 36, fontWeight: 600, letterSpacing: '-0.02em' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: card.x + (1 - cardIn) * 60,
          top: card.y + (V ? 60 : 40),
          width: cardW,
          opacity: clamp01((t - 1.7) / 0.15),
          background: C.paper,
          borderRadius: 28,
          padding: V ? '38px 40px' : '32px 34px',
          boxShadow: '0 30px 60px -30px rgba(10,30,20,.35)',
          color: C.ink,
        }}
      >
        <div style={{ fontSize: V ? 26 : 22, fontWeight: 600, opacity: 0.55 }}>Clase de prueba</div>
        <div style={{ fontSize: V ? 46 : 40, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>Jueves · 6:00 p. m.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 30 }}>
          <CheckDraw p={check} size={V ? 64 : 56} />
          <div
            style={{
              marginLeft: 'auto',
              background: C.forest,
              color: C.white,
              fontWeight: 700,
              fontSize: V ? 30 : 26,
              padding: V ? '20px 36px' : '18px 30px',
              borderRadius: 999,
              transform: `scale(${click})`,
            }}
          >
            Reservá tu clase
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: curX, top: curY, transform: `scale(${click})` }}>
        <CursorArrow size={V ? 64 : 54} />
      </div>
    </Bg>
  );
}

// 10 · 21–23 s · Blanco, frase
export function Entrena() {
  const t = useT();
  const { V } = useLayout();
  return (
    <Bg color={C.white}>
      <Center>
        <WordReveal
          text={V ? 'Entrená fuerte,\nsin lesionarte\ny nunca solo.' : 'Entrená fuerte, sin lesionarte\ny nunca solo.'}
          t={t}
          start={0.1}
          stagger={0.09}
          from="#C9D2CE"
          to={C.ink}
          out={1.74}
          outDur={0.26}
          accent={['solo']}
          accentColor={C.brand}
          style={{ fontSize: V ? 82 : 76, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.12 }}
        />
      </Center>
    </Bg>
  );
}

// 11 · 23–26 s · Segundo montaje, más energía (planos de 0,5 s)
function Strokes({ t, W, H }: { t: number; W: number; H: number }) {
  const paths = [
    `M -200 ${H * 0.3} C ${W * 0.25} ${H * 0.05}, ${W * 0.45} ${H * 0.55}, ${W * 0.7} ${H * 0.3} S ${W * 1.1} ${H * 0.2}, ${W + 200} ${H * 0.35}`,
    `M -200 ${H * 0.55} C ${W * 0.2} ${H * 0.75}, ${W * 0.5} ${H * 0.3}, ${W * 0.75} ${H * 0.6} S ${W * 1.05} ${H * 0.75}, ${W + 200} ${H * 0.55}`,
    `M -200 ${H * 0.8} C ${W * 0.3} ${H * 0.6}, ${W * 0.55} ${H * 0.95}, ${W * 0.8} ${H * 0.75} S ${W * 1.1} ${H * 0.7}, ${W + 200} ${H * 0.85}`,
  ];
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="stk" x1="0" x2="1">
          <stop offset="0" stopColor={C.mint} />
          <stop offset="1" stopColor={C.sky2} />
        </linearGradient>
      </defs>
      {paths.map((d, i) => {
        const p = prog(t, i * 0.05, 0.45);
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#stk)"
            strokeWidth={Math.min(W, H) * 0.085}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - p}
            transform={`translate(${-t * 80} 0)`}
          />
        );
      })}
    </svg>
  );
}

export function Montaje2() {
  const t = useT();
  const { V, W, H } = useLayout();
  const idx = Math.min(5, Math.floor(t / 0.5));
  const lt = t - idx * 0.5;

  if (idx === 0) {
    const z = lerp(0.9, 1.02, expoOut(lt / 0.5));
    return (
      <Bg color={C.sky1} style={{ background: `linear-gradient(180deg, ${C.sky1}, ${C.sky2})` }}>
        <Center style={{ flexDirection: 'column', gap: 34 }}>
          <div style={{ background: C.forest, color: C.white, padding: '12px 26px', borderRadius: 999, fontWeight: 700, fontSize: V ? 32 : 26 }}>
            Landing page de regalo
          </div>
          <div style={{ transform: `scale(${z})` }}>
            <BrowserMock heroSrc={src(PHOTO.levantamiento)} size={V ? 28 : 27} />
          </div>
        </Center>
      </Bg>
    );
  }
  if (idx === 1) {
    return (
      <Bg color={C.brand}>
        <Center style={{ flexDirection: 'column', gap: 6 }}>
          <CharReveal text="100%" t={lt} stagger={0.03} dur={0.45} style={{ fontSize: V ? 300 : 320, fontWeight: 800, letterSpacing: '-0.06em', color: C.white, lineHeight: 1 }} />
          <WordReveal text="de involucramiento" t={lt} start={0.08} stagger={0.06} dur={0.4} from="#8FD3B2" to={C.white} style={{ fontSize: V ? 70 : 66, fontWeight: 600, letterSpacing: '-0.02em' }} />
        </Center>
      </Bg>
    );
  }
  if (idx === 2) {
    const cols = V ? 2 : 4;
    const cw = V ? 470 : 390;
    const z = lerp(1.08, 1, expoOut(lt / 0.5));
    return (
      <Bg color={C.paper}>
        <Center>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gap: V ? 22 : 24, transform: `scale(${z})`, textAlign: 'left' }}>
            {Array.from({ length: 8 }, (_, i) => {
              const p = expoOut(clamp01((lt - i * 0.025) / 0.3));
              return <PackageCard key={i} index={i} size={V ? 25 : 22} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }} />;
            })}
          </div>
        </Center>
      </Bg>
    );
  }
  if (idx === 3) {
    const cw = V ? 960 : 1240;
    const ch = Math.round((cw * 474) / 730);
    return (
      <>
        <PhotoPlane photo={PHOTO.grupo} t={lt} dur={0.5} card={{ x: (W - cw) / 2, y: (H - ch) / 2 - (V ? 60 : 30), w: cw, h: ch, pos: '50% 50%' }} dim={0.55} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: (H + ch) / 2 + (V ? 0 : -10), textAlign: 'center' }}>
          <WordReveal text="“Seven Means Community”" t={lt} start={0.05} stagger={0.06} dur={0.4} style={{ fontSize: V ? 52 : 40, fontWeight: 600 }} />
        </div>
      </>
    );
  }
  if (idx === 4) {
    return (
      <Bg color={C.forest}>
        <Strokes t={lt} W={W} H={H} />
      </Bg>
    );
  }
  // Muro de miniaturas que se aleja (1.3 → 1)
  const tiles = [PHOTO.levantamiento, 'mint', PHOTO.anillas, PHOTO.banca, 'forest', PHOTO.equipo, PHOTO.concentracion, 'sky', PHOTO.grupo, PHOTO.fachada];
  const icons: IconName[] = ['instagram', 'whatsapp', 'google', 'calendar', 'dumbbell', 'heart', 'megaphone', 'chart'];
  const cols = V ? 5 : 8;
  const rows = V ? 9 : 5;
  const tw = V ? 250 : 290;
  const th = V ? 250 : 230;
  const z = lerp(1.3, 1, expoOut(lt / 0.5));
  return (
    <Bg color={C.black}>
      <Center>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tw}px)`, gap: 16, transform: `scale(${z})` }}>
          {Array.from({ length: cols * rows }, (_, i) => {
            const tile = tiles[(i * 7 + Math.floor(i / cols) * 3) % tiles.length];
            const base = { width: tw, height: th, borderRadius: 16, overflow: 'hidden' } as const;
            if (tile === 'mint' || tile === 'forest' || tile === 'sky') {
              const bg = tile === 'mint' ? C.mint : tile === 'forest' ? C.brand : C.sky1;
              return (
                <div key={i} style={{ ...base, background: bg, display: 'grid', placeItems: 'center', color: tile === 'sky' ? C.forest : C.white }}>
                  <Icon name={icons[i % icons.length]} size={72} />
                </div>
              );
            }
            return (
              <div key={i} style={base}>
                <Img src={src(tile)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            );
          })}
        </div>
      </Center>
    </Bg>
  );
}

// 12 · 26–28 s · Negro con tarjetas 3D flotando
export function Pilares() {
  const t = useT();
  const { V } = useLayout();
  const items: { kind: 'photo' | 'pkg' | 'post'; ref: string | number; x: number; y: number; z: number; ry: number; rx: number }[] = V
    ? [
        { kind: 'photo', ref: PHOTO.levantamiento, x: -300, y: -640, z: -200, ry: 20, rx: 8 },
        { kind: 'pkg', ref: 2, x: 290, y: -560, z: -100, ry: -18, rx: 6 },
        { kind: 'post', ref: PHOTO.anillas, x: -320, y: 560, z: -150, ry: 16, rx: -8 },
        { kind: 'photo', ref: PHOTO.grupo, x: 300, y: 640, z: -260, ry: -20, rx: -6 },
        { kind: 'pkg', ref: 6, x: 330, y: -330, z: -500, ry: -24, rx: 0 },
        { kind: 'photo', ref: PHOTO.concentracion, x: -330, y: 430, z: -520, ry: 24, rx: 0 },
      ]
    : [
        { kind: 'photo', ref: PHOTO.levantamiento, x: -640, y: -260, z: -200, ry: 20, rx: 6 },
        { kind: 'pkg', ref: 2, x: 600, y: -300, z: -120, ry: -18, rx: 6 },
        { kind: 'post', ref: PHOTO.anillas, x: -660, y: 290, z: -120, ry: 16, rx: -8 },
        { kind: 'photo', ref: PHOTO.grupo, x: 660, y: 290, z: -260, ry: -20, rx: -6 },
        { kind: 'pkg', ref: 6, x: -150, y: -400, z: -600, ry: 6, rx: 12 },
        { kind: 'photo', ref: PHOTO.concentracion, x: 180, y: 410, z: -560, ry: -8, rx: -12 },
      ];
  return (
    <Bg color={C.black}>
      <Sheen t={t + 26} strength={0.8} />
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: '50% 50%' }}>
        {items.map((it, i) => {
          const a = expoOut(clamp01((t - i * 0.06) / 0.7));
          const z = it.z - (1 - a) * 500 + t * 110;
          const ry = it.ry + Math.sin(t * 0.9 + i) * 5;
          const rx = it.rx + Math.cos(t * 0.8 + i) * 3;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                opacity: a,
                transform: `translate(-50%, -50%) translate3d(${it.x}px, ${it.y + Math.sin(t + i) * 10}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`,
              }}
            >
              {it.kind === 'photo' && (
                <div style={{ width: 300, height: 360, borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.5)' }}>
                  <Img src={src(it.ref as string)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              {it.kind === 'post' && <PostCard src={src(it.ref as string)} size={14} />}
              {it.kind === 'pkg' && <PackageCard index={it.ref as number} size={20} dark style={{ width: 320, background: '#151816' }} />}
            </div>
          );
        })}
      </AbsoluteFill>
      <Center>
        <WordReveal
          text={V ? 'Ordenar. Comunicar.\nVender. Crecer.' : 'Ordenar. Comunicar. Vender. Crecer.'}
          t={t}
          start={0.2}
          stagger={0.14}
          accent={['Crecer']}
          out={1.78}
          outDur={0.22}
          style={{ fontSize: V ? 70 : 60, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}
        />
      </Center>
    </Bg>
  );
}

// 13 · 28–30 s · Verde oscuro, precio
export function Precio() {
  const t = useT();
  const { V } = useLayout();
  return (
    <Bg color={C.forest}>
      <Center style={{ flexDirection: 'column', gap: V ? 24 : 18 }}>
        <WordReveal text="PAQUETE BOLD × SEVENLAB" t={t} start={0.05} stagger={0.05} from="#2C4A40" to="#9FD9BD" style={{ fontSize: V ? 28 : 24, fontWeight: 700, letterSpacing: '0.22em' }} />
        <CharReveal text={PRECIO} t={t} start={0.15} stagger={0.045} dur={0.75} style={{ fontSize: V ? 220 : 250, fontWeight: 800, letterSpacing: '-0.05em', color: C.mint, lineHeight: 1 }} />
        <WordReveal text={PRECIO_DETALLE} t={t} start={0.65} stagger={0.08} from="#4D6B61" to={C.white} style={{ fontSize: V ? 58 : 54, fontWeight: 500, letterSpacing: '-0.02em' }} />
      </Center>
    </Bg>
  );
}

// 14 · 30–33 s · Íconos → grilla → barra de búsqueda
const ICONOS: IconName[] = ['instagram', 'whatsapp', 'google', 'calendar', 'dumbbell', 'heart', 'megaphone', 'chart'];
const QUERY = 'BOLD × SevenLab';

export function Busqueda() {
  const t = useT();
  const { V, W, H } = useLayout();
  const d = V ? 150 : 132;
  const scattered = V
    ? [[-330, -620], [260, -700], [-280, -230], [330, -300], [-350, 300], [300, 240], [-200, 690], [270, 630]]
    : [[-640, -270], [-200, -350], [320, -290], [700, -200], [-720, 190], [-260, 310], [250, 260], [660, 330]];
  const gap = V ? 205 : 190;
  const grid = ICONOS.map((_, i) => [((i % 4) - 1.5) * gap, (Math.floor(i / 4) - 0.5) * (V ? 210 : 190)]);
  const barW = V ? 860 : 780;
  const barH = V ? 120 : 104;
  const b = spring(t - 1.45, 170, 18);
  const chars = Math.max(0, Math.min(QUERY.length, Math.floor((t - 1.8) / 0.045)));
  const caretOn = Math.floor(t * 3) % 2 === 0 || (t > 1.8 && chars < QUERY.length);
  const btnD = barH - 22;
  const btnX = W / 2 + barW / 2 - 11 - btnD / 2;
  const btnY = H / 2;
  const cur = prog(t, 2.15, 0.5);
  const curX = lerp(W / 2 + (V ? 420 : 620), btnX + 6, cur);
  const curY = lerp(H / 2 + (V ? 520 : 300), btnY + 8, cur);
  const click = t > 2.68 && t < 2.88 ? 1 - Math.sin(((t - 2.68) / 0.2) * Math.PI) * 0.12 : 1;
  const ripple = prog(t, 2.72, 0.5);
  return (
    <Bg color={C.sky1} style={{ background: `linear-gradient(180deg, ${C.sky1} 0%, ${C.sky2} 100%)` }}>
      {ICONOS.map((name, i) => {
        const s0 = spring(t - i * 0.035, 220, 17);
        const g = spring(t - 0.35 - i * 0.03, 120, 15);
        const c = prog(t, 1.2 + i * 0.02, 0.42, expoInOut);
        const x = lerp(lerp(scattered[i][0], grid[i][0], g), 0, c);
        const y = lerp(lerp(scattered[i][1], grid[i][1], g), 0, c);
        const sc = s0 * lerp(1, 0.25, c);
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: W / 2 + x - d / 2,
              top: H / 2 + y - d / 2,
              width: d,
              height: d,
              borderRadius: '50%',
              background: C.white,
              display: 'grid',
              placeItems: 'center',
              color: C.forest,
              boxShadow: '0 18px 40px -18px rgba(30,60,90,.45)',
              transform: `scale(${sc})`,
              opacity: 1 - c,
            }}
          >
            <Icon name={name} size={d * 0.42} />
          </div>
        );
      })}
      {t > 1.3 && (
        <div
          style={{
            position: 'absolute',
            left: W / 2 - lerp(70, barW, b) / 2,
            top: H / 2 - barH / 2,
            width: lerp(70, barW, b),
            height: barH,
            borderRadius: 999,
            background: C.white,
            boxShadow: '0 30px 60px -30px rgba(30,60,90,.5)',
            opacity: clamp01((t - 1.3) / 0.12),
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: V ? 48 : 42,
            fontSize: V ? 44 : 38,
            fontWeight: 600,
            color: C.ink,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          {QUERY.slice(0, chars)}
          <span style={{ display: 'inline-block', width: 3, height: '1.1em', marginLeft: 4, background: C.brand, opacity: caretOn && b > 0.6 ? 1 : 0 }} />
        </div>
      )}
      {t > 1.3 && (
        <div
          style={{
            position: 'absolute',
            left: btnX - btnD / 2,
            top: btnY - btnD / 2,
            width: btnD,
            height: btnD,
            borderRadius: '50%',
            background: C.forest,
            color: C.white,
            display: 'grid',
            placeItems: 'center',
            opacity: clamp01((b - 0.7) / 0.3),
            transform: `scale(${click})`,
          }}
        >
          <svg width={btnD * 0.42} height={btnD * 0.42} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L20 20" />
          </svg>
        </div>
      )}
      {ripple > 0 && ripple < 1 && (
        <div
          style={{
            position: 'absolute',
            left: btnX - btnD,
            top: btnY - btnD,
            width: btnD * 2,
            height: btnD * 2,
            borderRadius: '50%',
            border: `3px solid ${C.mint}`,
            transform: `scale(${0.4 + ripple * 0.9})`,
            opacity: 1 - ripple,
          }}
        />
      )}
      {t > 2.1 && (
        <div style={{ position: 'absolute', left: curX, top: curY, transform: `scale(${click})` }}>
          <CursorArrow size={V ? 64 : 56} />
        </div>
      )}
    </Bg>
  );
}

// 15 · 33–36 s · Logo + cierre
export function Logo() {
  const t = useT();
  const { V } = useLayout();
  return (
    <Bg color={C.white}>
      <Center style={{ flexDirection: 'column', gap: V ? 40 : 34 }}>
        <Logotype t={t} start={0.15} size={V ? 64 : 92} />
        <WordReveal text="Empecemos esta semana" t={t} start={1.0} stagger={0.09} from="#C5CDC9" to={C.ink} style={{ fontSize: V ? 50 : 42, fontWeight: 500, letterSpacing: '-0.01em' }} />
      </Center>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: V ? 90 : 56, textAlign: 'center', fontSize: V ? 24 : 18, color: '#8A938F', opacity: prog(t, 1.6, 0.6) }}>
        {CREDITOS}
      </div>
    </Bg>
  );
}

