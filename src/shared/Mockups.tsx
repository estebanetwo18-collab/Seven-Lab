import type { CSSProperties } from 'react';
import { C, CHAT, PAQUETE } from './tokens';
import { Icon } from './Icons';
import { clamp01, prog, spring } from './motion';
import { useImg } from './ImgContext';
import { SR_ONLY } from './Text';

// Todos los mockups se dimensionan en `em`: cambiando `fontSize` del
// contenedor se escalan enteros, igual en la landing y en el video.

type ImgSrc = { src: string };

/** Publicación de Instagram con una foto del box. */
export function PostCard({ src, caption, size = 16, style }: ImgSrc & { caption?: string; size?: number; style?: CSSProperties }) {
  const Img = useImg();
  return (
    <div
      style={{
        fontSize: size,
        width: '18em',
        background: C.white,
        borderRadius: '1.1em',
        overflow: 'hidden',
        boxShadow: '0 1.6em 3em -1.2em rgba(10,20,30,.35), 0 0 0 1px rgba(10,20,30,.06)',
        color: C.ink,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '.55em', padding: '.7em .8em' }}>
        <div
          style={{
            width: '1.9em',
            height: '1.9em',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.mint}, ${C.brand})`,
            display: 'grid',
            placeItems: 'center',
            color: C.white,
            fontWeight: 800,
            fontSize: '.8em',
          }}
        >
          S7
        </div>
        <div style={{ fontWeight: 700, fontSize: '.85em' }}>sevenlab7</div>
        <div style={{ marginLeft: 'auto', letterSpacing: '.1em', opacity: 0.5 }}>•••</div>
      </div>
      <Img src={src} alt="" style={{ display: 'block', width: '100%', aspectRatio: '4 / 5', objectFit: 'cover' }} />
      <div style={{ display: 'flex', gap: '.7em', padding: '.7em .8em .2em' }}>
        <Icon name="heart" size={22} style={{ width: '1.25em', height: '1.25em' }} />
        <Icon name="whatsapp" size={22} style={{ width: '1.25em', height: '1.25em' }} />
        <Icon name="instagram" size={22} style={{ width: '1.25em', height: '1.25em', marginLeft: 'auto' }} />
      </div>
      {caption && (
        <div style={{ padding: '.3em .8em .9em', fontSize: '.8em', lineHeight: 1.35 }}>
          <b>sevenlab7</b> {caption}
        </div>
      )}
    </div>
  );
}

/** Teléfono con el chat de WhatsApp del asistente. `t` en segundos; `times` = momento de cada burbuja. */
export function PhoneChat({
  t,
  times,
  size = 16,
  typing = true,
  style,
}: {
  t: number;
  times: number[];
  size?: number;
  typing?: boolean;
  style?: CSSProperties;
}) {
  const nextIdx = times.findIndex((at) => t < at);
  const showTyping =
    typing && nextIdx >= 0 && CHAT[nextIdx].from === 'us' && t > times[nextIdx] - 0.45 && t < times[nextIdx];
  return (
    <div
      role="img"
      aria-label="Conversación de ejemplo con el asistente de WhatsApp de SevenLab"
      style={{
        fontSize: size,
        width: '19.5em',
        height: '38em',
        borderRadius: '3em',
        background: '#111',
        padding: '.7em',
        boxShadow: '0 3em 5em -2em rgba(10,20,30,.45)',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '2.35em',
          overflow: 'hidden',
          background: '#EFEAE2',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div
          style={{
            background: C.forest,
            color: C.white,
            padding: '2.6em 1em .9em',
            display: 'flex',
            alignItems: 'center',
            gap: '.7em',
          }}
        >
          <div
            style={{
              width: '2.3em',
              height: '2.3em',
              borderRadius: '50%',
              background: C.mint,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              color: C.forest,
              fontSize: '.85em',
            }}
          >
            S7
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700 }}>SevenLab</div>
            <div style={{ fontSize: '.72em', opacity: 0.75 }}>{showTyping ? 'escribiendo…' : 'en línea'}</div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '.55em',
            padding: '1em .85em 1.2em',
            overflow: 'hidden',
          }}
        >
          {CHAT.map((m, i) => {
            const local = t - times[i];
            if (local < 0) return null;
            const s = spring(local, 260, 20);
            const mine = m.from === 'us';
            return (
              <div
                key={i}
                style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  background: mine ? '#D9FDD3' : C.white,
                  color: C.ink,
                  borderRadius: mine ? '1em 1em .25em 1em' : '1em 1em 1em .25em',
                  padding: '.6em .8em',
                  fontSize: '.86em',
                  lineHeight: 1.35,
                  boxShadow: '0 1px 1px rgba(0,0,0,.08)',
                  opacity: clamp01(local / 0.12),
                  transform: `translateY(${(1 - s) * 18}px) scale(${0.85 + 0.15 * s})`,
                  transformOrigin: mine ? 'bottom right' : 'bottom left',
                }}
              >
                {m.text}
              </div>
            );
          })}
          {showTyping && (
            <div
              style={{
                alignSelf: 'flex-end',
                background: '#D9FDD3',
                borderRadius: '1em 1em .25em 1em',
                padding: '.7em .9em',
                display: 'flex',
                gap: '.3em',
              }}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  style={{
                    width: '.45em',
                    height: '.45em',
                    borderRadius: '50%',
                    background: C.brand,
                    opacity: 0.35 + 0.65 * Math.abs(Math.sin((t * 6 + d) * 1.2)),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Vista de ejemplo de la landing de regalo (diapositiva 9). */
export function BrowserMock({ heroSrc, size = 16, style }: { heroSrc: string; size?: number; style?: CSSProperties }) {
  const Img = useImg();
  return (
    <div
      role="img"
      aria-label="Vista de ejemplo de la landing page de SevenLab"
      style={{
        fontSize: size,
        width: '34em',
        background: C.white,
        borderRadius: '1.2em',
        overflow: 'hidden',
        boxShadow: '0 2.4em 4em -1.8em rgba(10,20,30,.45), 0 0 0 1px rgba(10,20,30,.06)',
        color: C.ink,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '.4em', padding: '.75em 1em', background: '#F1F3F2' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span key={c} style={{ width: '.65em', height: '.65em', borderRadius: '50%', background: c }} />
        ))}
        <div
          style={{
            marginLeft: '.8em',
            flex: 1,
            background: C.white,
            borderRadius: '.6em',
            padding: '.3em .8em',
            fontSize: '.72em',
            color: '#5b6560',
          }}
        >
          www.sevenlab… (tu dominio)
        </div>
      </div>
      <div style={{ position: 'relative', height: '15em' }}>
        <Img src={heroSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(14,42,34,.92) 0%, rgba(14,42,34,.55) 55%, rgba(14,42,34,.1) 100%)' }} />
        <div style={{ position: 'absolute', left: '1.6em', top: '50%', transform: 'translateY(-50%)', color: C.white, maxWidth: '15em' }}>
          <div style={{ fontWeight: 800, fontSize: '1.45em', lineHeight: 1.1, letterSpacing: '-.02em' }}>
            Entrená fuerte, sin lesionarte y nunca solo
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: '1em',
              background: C.mint,
              color: C.forest,
              fontWeight: 700,
              fontSize: '.8em',
              padding: '.6em 1.1em',
              borderRadius: '99em',
            }}
          >
            Reservá tu clase
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45em', padding: '1em 1.2em 1.2em' }}>
        {['Clases y horarios', 'Planes', 'Fisio', 'Comunidad', 'Ubicación', 'WhatsApp'].map((x) => (
          <span key={x} style={{ fontSize: '.7em', padding: '.45em .9em', borderRadius: '99em', background: C.paper, fontWeight: 600 }}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Tarjeta de uno de los 8 elementos del paquete. */
export function PackageCard({
  index,
  size = 16,
  dark = false,
  style,
}: {
  index: number;
  size?: number;
  dark?: boolean;
  style?: CSSProperties;
}) {
  const item = PAQUETE[index];
  return (
    <div
      style={{
        fontSize: size,
        background: dark ? 'rgba(255,255,255,.06)' : C.white,
        border: dark ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(10,20,30,.07)',
        color: dark ? C.white : C.ink,
        borderRadius: '1.1em',
        padding: '1.2em 1.2em 1.3em',
        display: 'flex',
        flexDirection: 'column',
        gap: '.7em',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            width: '2.6em',
            height: '2.6em',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: dark ? 'rgba(79,192,141,.14)' : '#E6F4EC',
            color: dark ? C.mint : C.brand,
          }}
        >
          <Icon name={item.icon} size={22} style={{ width: '1.35em', height: '1.35em' }} />
        </span>
        <span style={{ fontSize: '.75em', opacity: 0.45, fontWeight: 600 }}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: '1.05em', lineHeight: 1.2, letterSpacing: '-.01em' }}>{item.title}</div>
      <div style={{ fontSize: '.85em', lineHeight: 1.4, opacity: 0.7 }}>{item.desc}</div>
    </div>
  );
}

/** Logotipo tipográfico (no hay logos en ./assets). */
export function Logotype({
  t,
  start = 0,
  size = 64,
  color = C.ink,
  style,
}: {
  t: number;
  start?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const parts: { txt: string; w: number; c?: string }[] = [
    { txt: 'BOLD', w: 800 },
    { txt: ' Agency', w: 400 },
    { txt: '  ×  ', w: 300, c: '#9AA5A0' },
    { txt: 'Seven', w: 800, c: C.brand },
    { txt: 'Lab', w: 400, c: C.brand },
  ];
  let k = 0;
  return (
    <div style={{ fontSize: size, color, letterSpacing: '-.03em', whiteSpace: 'pre', lineHeight: 1.1, ...style }}>
      <span style={SR_ONLY}>BOLD Agency × SevenLab</span>
      {parts.map((part, pi) => (
        <span key={pi} aria-hidden style={{ fontWeight: part.w, color: part.c }}>
          {Array.from(part.txt).map((ch, i) => {
            const p = prog(t, start + k++ * 0.04, 0.75);
            return (
              <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '.08em', marginBottom: '-.08em' }}>
                <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)` }}>{ch}</span>
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
