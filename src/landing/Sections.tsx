import { motion, useReducedMotion } from 'framer-motion';
import { C, CREDITOS, PAQUETE, PHOTO, PRECIO, PRECIO_DETALLE, WHATSAPP_URL, fmt } from '../shared/tokens';
import { EASE_EXPO_OUT, prog } from '../shared/motion';
import { CharReveal, Counter, DrawLine, WordReveal } from '../shared/Text';
import { BrowserMock, Logotype, PackageCard, PhoneChat, PostCard } from '../shared/Mockups';
import { asset, useClock } from './hooks';
import { CheckList, Cross, Heading, Rise, Section } from './ui';

// 2 · Lo que entendimos de SevenLab
export function Entendimos() {
  const reduce = useReducedMotion();
  const items = [
    ['Qué es', 'Un box de entrenamiento funcional en Lagunilla, Heredia'],
    ['Qué representa', '“Entrenamiento como estilo de vida” y “Seven Means Community”'],
    ['Qué experiencia ofrece', 'Clases guiadas, competencia interna y atletas que compiten'],
    ['Qué lo diferencia', 'Fisio dentro del box, parqueo amplio y baños accesibles'],
  ];
  return (
    <Section id="entendimos">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Rise className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[28px] bg-paper">
            <img
              src={asset(PHOTO.fachada)}
              alt="Fachada de SevenLab Health & Fitness, con su rótulo y cajones de salto"
              width={464}
              height={555}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <p className="mt-3 text-xs text-ink/65">{CREDITOS}</p>
        </Rise>
        <div className="order-1 lg:order-2">
          <Heading eyebrow="Contexto" title="Lo que entendimos de SevenLab" />
          <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {items.map(([k, v], i) => (
              <motion.div
                key={k}
                className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
                initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE_EXPO_OUT }}
              >
                <dt className="text-sm font-bold text-brand">{k}</dt>
                <dd className="text-lg leading-snug">{v}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

// 3 · Lo que se ve desde afuera (barras animadas)
export function DesdeAfuera() {
  return (
    <Section tone="dark" id="desde-afuera">
      <Heading dark eyebrow="Contexto" title="Lo que se ve desde afuera todavía no refleja lo que hay adentro" />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Rise>
          <BarChart
            title="Seguidores en Instagram"
            data={[
              ['Catharsis', 17200],
              ['Cabila', 7810],
              ['Kapnos', 2354],
              ['SevenLab', 1913],
            ]}
          />
        </Rise>
        <Rise delay={0.1}>
          <BarChart
            title="Reseñas en Google"
            data={[
              ['TFT', 96],
              ['Kapnos', 66],
              ['Cabila', 60],
              ['Catharsis', 26],
              ['SevenLab', 1],
            ]}
          />
        </Rise>
      </div>
      <Rise delay={0.15}>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-white/85">
          11 semanas sin publicaciones propias · ficha de Google sin reclamar · 0 de 5 boxes auditados comunica fisioterapia
        </p>
        <p className="mt-4 text-xs text-white/60">Fuente: Instagram y Google Maps, sept.–oct. 2026</p>
      </Rise>
    </Section>
  );
}

// Barra que crece al ancho real (la animación es scaleX sobre el ancho final).
function BarChart({ title, data }: { title: string; data: [string, number][] }) {
  const max = Math.max(...data.map((d) => d[1]));
  const reduce = useReducedMotion();
  const [ref, t] = useClock(3);
  return (
    <figure ref={ref} className="rounded-[24px] bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8">
      <figcaption className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-white/60">{title}</figcaption>
      <ul className="space-y-4">
        {data.map(([name, v], i) => {
          const me = name === 'SevenLab';
          return (
            <li key={name} className="grid grid-cols-[5.5rem_1fr_3.6rem] items-center gap-3 text-sm sm:grid-cols-[7rem_1fr_4rem]">
              <span className={me ? 'font-bold text-mint' : 'text-white/80'}>{name}</span>
              <div className="h-3 rounded-full bg-white/[0.06]">
                <motion.div
                  className={`h-full rounded-full ${me ? 'bg-mint' : 'bg-white/45'}`}
                  style={{ width: `${Math.max(1.5, (v / max) * 100)}%`, originX: 0 }}
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.2, delay: 0.15 + i * 0.08, ease: EASE_EXPO_OUT }}
                />
              </div>
              <Counter to={v} t={t} start={0.15 + i * 0.08} dur={1.2} format={fmt} className={`text-right font-bold ${me ? 'text-mint' : ''}`} />
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

// 4 · Tres cosas que hoy le están costando clientes a SevenLab
export function TresCosas() {
  const cosas = [
    ['Cuesta encontrarlo y confiar', 'Una sola reseña en Google y una ficha sin teléfono ni horario. Quien busca un box en Heredia elige al que ve más confiable.'],
    ['Su diferencia no se cuenta', 'Tiene fisio y una comunidad real, pero no aparece en sus redes. Desde afuera se ve igual que cualquier otro gimnasio.'],
    ['Los interesados se enfrían', 'Todo depende de responder WhatsApp a mano, y el precio solo está en historias. Cada mensaje sin respuesta rápida es un cliente que se va a otro box.'],
  ];
  return (
    <Section id="hallazgos">
      <Heading eyebrow="Lo que encontramos" title="Tres cosas que hoy le están costando clientes a SevenLab" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cosas.map(([title, body], i) => (
          <Rise key={title} delay={i * 0.1}>
            <article className="h-full rounded-[24px] bg-paper p-7">
              <span className="text-5xl font-bold tracking-tight text-brand/25">0{i + 1}</span>
              <h3 className="mt-6 text-xl font-bold tracking-tight">{title}</h3>
              <p className="mt-3 leading-relaxed text-ink/70">{body}</p>
            </article>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// 5 · El paquete BOLD (8 tarjetas)
export function Paquete() {
  const reduce = useReducedMotion();
  return (
    <Section tone="sky" id="paquete">
      <Heading eyebrow="El paquete BOLD para SevenLab" title="Todo lo que incluye, en un solo paquete mensual" />
      <div className="mt-12 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {PAQUETE.map((_, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 40, rotate: i % 2 ? 3 : -3, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: (i % 4) * 0.07, ease: EASE_EXPO_OUT }}
            whileHover={reduce ? undefined : { y: -6 }}
          >
            <PackageCard index={i} size={16} style={{ height: '100%', boxShadow: '0 20px 40px -28px rgba(30,60,90,.45)' }} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// 6 · 10 contenidos al mes
export function Contenidos() {
  const [ref, t] = useClock(3);
  const temas = [
    'Cómo es entrenar en SevenLab',
    'Qué lo hace diferente',
    'La historia de la marca',
    'Tips para quien empieza',
    'Historias de miembros',
    'Los coaches',
    'La comunidad',
    'Invitaciones a probar',
  ];
  return (
    <Section id="contenidos">
      <Heading eyebrow="Incluido en el paquete" title="10 contenidos al mes, hechos por nosotros" />
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <div ref={ref} className="flex items-end gap-4">
            <Counter to={10} t={t} dur={1.2} className="text-[7rem] font-bold leading-[0.85] tracking-[-0.06em] text-brand sm:text-[9rem]" />
            <p className="pb-3 text-lg font-semibold leading-tight">
              contenidos
              <br />
              cada mes
            </p>
          </div>
          <h3 className="mb-4 mt-10 text-sm font-bold uppercase tracking-[0.18em] text-ink/70">Cada mes incluye</h3>
          <CheckList
            items={['Las ideas y el calendario del mes', 'Guion, diseño y edición de cada pieza', 'Publicación en tus redes', 'Una jornada de grabación en el box']}
          />
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-ink/70">De qué van a hablar</h3>
          <div className="flex flex-wrap gap-2.5">
            {temas.map((x, i) => (
              <Rise key={x} delay={i * 0.05} y={12}>
                <span className="block rounded-full bg-paper px-4 py-2.5 text-[0.95rem] font-semibold">{x}</span>
              </Rise>
            ))}
          </div>
          <div className="relative mt-10 flex h-[260px] items-center justify-center sm:h-[300px]">
            {[PHOTO.levantamiento, PHOTO.anillas, PHOTO.equipo].map((p, i) => (
              <Rise key={p} delay={0.1 + i * 0.1} className="absolute" y={50}>
                <div style={{ transform: `translateX(${(i - 1) * 88}px) rotate(${(i - 1) * 8}deg)`, zIndex: i === 1 ? 2 : 1 }}>
                  <PostCard src={asset(p)} size={9} />
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
      <Rise>
        <blockquote className="mt-14 border-l-4 border-mint pl-5 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
          Ninguno es para “llenar el feed”: cada contenido busca que más gente conozca el box y escriba para probar.
        </blockquote>
      </Rise>
    </Section>
  );
}

// 7 · Asistente de WhatsApp (mismo chat del plano 9 del video)
export function WhatsApp() {
  const [ref, t] = useClock(6, 0.4);
  return (
    <Section tone="paper" id="whatsapp">
      <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
        <div ref={ref} className="order-2 flex justify-center lg:order-1">
          <PhoneChat t={t} times={[0.3, 1.1, 1.9, 2.7, 3.5]} size={15} />
        </div>
        <div className="order-1 lg:order-2">
          <Heading eyebrow="Incluido en el paquete" title="Un asistente de WhatsApp que responde por vos" />
          <div className="mt-10">
            <CheckList
              items={[
                'Responde al instante preguntas de precios, horarios y clases',
                'Agenda clases de prueba',
                'Guarda los datos de cada persona interesada',
                'Le escribe de nuevo a quien no terminó de inscribirse',
                'Te pasa a vos las conversaciones importantes',
              ]}
            />
          </div>
          <Rise>
            <p className="mt-8 rounded-2xl bg-white p-5 font-semibold leading-relaxed">
              No reemplaza a tu equipo: le quita lo repetitivo para que nadie se quede sin respuesta.
            </p>
            <p className="mt-3 text-xs text-ink/65">Conversación de ejemplo.</p>
          </Rise>
        </div>
      </div>
    </Section>
  );
}

// 8 · Presencia, promociones y comunidad
export function TresColumnas() {
  const cols: [string, string[]][] = [
    [
      'Presencia digital en orden',
      [
        'Instagram claro: qué es SevenLab y cómo probar',
        'Google Maps completo, con teléfono, horario y fotos',
        'Más reseñas de tus miembros',
        'Precio, horarios y prueba fáciles de encontrar',
      ],
    ],
    [
      'Promociones que venden',
      [
        'Te ayudamos a decidir qué promoción conviene',
        'Que atraiga sin bajar el valor de SevenLab',
        'Campañas para fechas clave: Día de la Mascarada y Viernes Negro',
      ],
    ],
    [
      'Una comunidad que se queda',
      ['Reconocimiento a tus miembros', 'Mensajes para que vuelvan quienes dejaron de venir', 'Que tus miembros recomienden el box'],
    ],
  ];
  return (
    <Section id="presencia">
      <Heading eyebrow="Incluido en el paquete" title="Presencia, promociones y comunidad" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cols.map(([title, items], i) => (
          <Rise key={title} delay={i * 0.1}>
            <article className="h-full rounded-[24px] border border-ink/10 p-7">
              <h3 className="mb-6 text-xl font-bold tracking-tight">{title}</h3>
              <CheckList items={items} />
            </article>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// 9 · Landing page de regalo
export function Regalo() {
  return (
    <Section tone="sky" id="landing">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <span className="mb-6 inline-block rounded-full bg-forest px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-mint">
            Sin costo
          </span>
          <Heading title="Además, una landing page para SevenLab, de regalo" />
          <div className="mt-10">
            <CheckList
              items={[
                'Diseño y desarrollo completo de la página',
                'Toda la información en un solo lugar: clases, horarios, planes, fisio y comunidad',
                'Botón directo a WhatsApp y al asistente',
                'Se ve bien en el celular',
                'Ayuda a que te encuentren en Google',
              ]}
            />
          </div>
          <p className="mt-6 text-sm text-ink/70">Dominio: aprox. US$11, se paga aparte</p>
        </div>
        <Rise y={60}>
          <div className="flex justify-center">
            <BrowserMock heroSrc={asset(PHOTO.levantamiento)} size={11} style={{ maxWidth: '100%', fontSize: 'clamp(8.5px, 2.4vw, 15px)' }} />
          </div>
          <p className="mt-3 text-center text-xs text-ink/65">Vista de ejemplo. {CREDITOS}</p>
        </Rise>
      </div>
    </Section>
  );
}

// 10 · 100% de involucramiento
export function Involucramiento() {
  const [ref, t] = useClock(3);
  return (
    <Section tone="forest" id="involucramiento">
      <div ref={ref} className="text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-mint">100% de involucramiento</p>
        <div className="text-[6.5rem] font-bold leading-none tracking-[-0.06em] sm:text-[11rem]">
          <Counter to={100} t={t} dur={1.4} />%
        </div>
        <WordReveal
          as="h2"
          text="Compromiso real, dentro de un alcance claro."
          t={t}
          start={0.5}
          stagger={0.07}
          from="#3d5a50"
          to={C.white}
          className="mx-auto mt-6 max-w-2xl text-2xl font-bold tracking-tight sm:text-4xl"
        />
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <Rise>
          <div className="h-full rounded-[24px] bg-white/[0.06] p-7 ring-1 ring-white/10">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-mint">Sí es</h3>
            <CheckList
              tone="mint"
              items={[
                'Responsabilidad y dirección integral de la marca, dentro del alcance contratado',
                'Seguimiento constante del contenido, el WhatsApp y las promociones',
                'Acompañamiento cercano en las decisiones comerciales y de marca',
              ]}
            />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div className="h-full rounded-[24px] p-7 ring-1 ring-white/15">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white/60">No es</h3>
            <ul className="space-y-3.5">
              {[
                'Disponibilidad 24/7 ni respuesta inmediata a cualquier hora',
                'Piezas o producción ilimitada fuera del alcance mensual',
                'Trabajo sin límites ni prioridades definidas',
              ].map((x) => (
                <li key={x} className="flex gap-3 text-[1.02rem] leading-relaxed text-white/75">
                  <Cross className="text-white/60" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// 11 · Lo que SevenLab tiene cada mes
export function CadaMes() {
  const [ref, t] = useClock(3);
  const stats: [number, string, string][] = [
    [10, '', 'contenidos para redes'],
    [1, '', 'jornada de grabación en el box'],
    [1, '', 'asistente de WhatsApp activo'],
    [1, '', 'reporte y reunión de resultados'],
    [100, '%', 'de involucramiento de BOLD'],
  ];
  return (
    <Section id="cada-mes">
      <Heading eyebrow="Resumen del paquete" title="Lo que SevenLab tiene cada mes" />
      <div ref={ref} className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(([n, suf, label], i) => (
          <div key={label} className="border-t-2 border-ink pt-5">
            <div className="text-6xl font-bold tracking-[-0.05em] text-brand">
              <Counter to={n} t={t} start={i * 0.08} dur={1.1} />
              {suf}
            </div>
            <p className="mt-2 font-semibold leading-snug">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <Rise>
          <div className="h-full rounded-[24px] bg-paper p-7">
            <h3 className="mb-6 text-xl font-bold tracking-tight">Y además, todos los meses</h3>
            <CheckList
              items={['Instagram y Google al día', 'Promociones y fechas clave evaluadas', 'Acciones para que los miembros se queden y recomienden']}
            />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div className="h-full rounded-[24px] bg-paper p-7">
            <h3 className="mb-6 text-xl font-bold tracking-tight">Una sola vez, al inicio</h3>
            <CheckList items={['Landing page de regalo', 'Configuración del asistente de WhatsApp', 'Orden inicial de Instagram y Google']} />
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// 12 · Cómo arrancamos (línea de tiempo que se dibuja)
export function Arranque() {
  const [ref, t] = useClock(3);
  const pasos = [
    ['Semana 1', 'Ordenamos', 'Instagram, Google, horarios, precios y forma de contacto'],
    ['Semanas 2 a 4', 'Publicamos y activamos', 'Salen los primeros contenidos y el asistente de WhatsApp empieza a atender'],
    ['Fin de mes', 'Te mostramos resultados', 'Reporte sencillo, reunión de 30 minutos y ajustes para el mes 2'],
  ];
  return (
    <Section tone="paper" id="arranque">
      <Heading eyebrow="El primer mes" title="Cómo arrancamos" />
      <div ref={ref} className="relative mt-14">
        <div className="absolute left-0 right-0 top-[7px] hidden md:block">
          <DrawLine t={t} start={0.1} dur={1.4} color={C.ink} thickness={2} style={{ transformOrigin: 'left' }} />
        </div>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
          {pasos.map(([cuando, titulo, desc], i) => {
            const p = prog(t, 0.25 + i * 0.35, 0.8);
            return (
              <li key={cuando} className="relative pl-8 md:pl-0" style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                <span className="absolute left-0 top-0 h-4 w-4 rounded-full border-[3px] border-paper bg-brand ring-2 ring-brand md:relative md:block" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand md:mt-6">{cuando}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{titulo}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
      <Rise>
        <p className="mt-14 rounded-2xl bg-white p-5 leading-relaxed">
          <b>De tu parte:</b> aprobar los contenidos, darnos acceso a tus cuentas y una jornada de grabación al mes.
        </p>
      </Rise>
    </Section>
  );
}

// 13 · Inversión
export function Inversion() {
  const [ref, t] = useClock(3);
  return (
    <Section tone="dark" id="inversion">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div ref={ref}>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-mint">Inversión · Paquete BOLD × SevenLab</p>
          <h2>
            <CharReveal
              text={PRECIO}
              t={t}
              start={0.1}
              stagger={0.045}
              style={{ fontSize: 'clamp(4rem, 15vw, 9.5rem)', fontWeight: 800, letterSpacing: '-0.05em', color: C.mint, lineHeight: 1 }}
            />
            <WordReveal
              as="span"
              text={PRECIO_DETALLE}
              t={t}
              start={0.6}
              stagger={0.08}
              style={{ display: 'block', marginTop: 12 }}
              className="text-2xl font-semibold tracking-tight sm:text-4xl"
            />
          </h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/80" style={{ opacity: prog(t, 1, 0.8) }}>
            Todo el paquete durante 2 meses para conocer el trabajo y ver resultados.
          </p>
        </div>
        <Rise delay={0.15}>
          <div className="rounded-[24px] p-7 ring-1 ring-white/15">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white/60">No incluye</h3>
            <ul className="space-y-3.5 text-white/80">
              {[
                'Inversión en anuncios pagados',
                'Sesiones de fotos o video especiales',
                'Costos de la plataforma del asistente de WhatsApp',
                'Dominio de la landing page (aprox. US$11)',
                'Premios y materiales de promociones',
              ].map((x) => (
                <li key={x} className="flex gap-3 leading-relaxed">
                  <Cross className="text-white/65" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// 14 · Cierre
export function Cierre() {
  const [ref, t] = useClock(4);
  const pasos = [
    'Aprobás la propuesta',
    'Nos das acceso a Instagram, Google y WhatsApp',
    'Una reunión de una hora para conocer precios, horarios y la historia del box',
    'En la semana 1 ya estamos ordenando todo',
  ];
  return (
    <Section id="cierre" className="pb-12 sm:pb-16 lg:pb-20">
      <div ref={ref} className="text-center">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-brand">Próximos pasos</p>
        <WordReveal
          as="h2"
          text="Empecemos esta semana."
          t={t}
          stagger={0.09}
          from="#C5CDC9"
          to={C.ink}
          className="text-[2.6rem] font-bold leading-none tracking-[-0.04em] sm:text-7xl"
        />
      </div>
      <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
        {pasos.map((x, i) => (
          <Rise key={x} delay={i * 0.08} y={20}>
            <div className="flex h-full items-start gap-4 rounded-2xl bg-paper p-5">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-forest text-sm font-bold text-mint">{i + 1}</span>
              <span className="pt-1.5 font-semibold leading-snug">{x}</span>
            </div>
          </Rise>
        ))}
      </div>
      <Rise className="mt-12 text-center">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 rounded-full bg-forest px-8 py-5 text-lg font-bold text-white shadow-[0_20px_40px_-20px_rgba(14,42,34,.7)] transition duration-500 ease-expo hover:-translate-y-0.5 hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 fill-mint">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" />
          </svg>
          Hablemos por WhatsApp
          <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1">→</span>
        </a>
      </Rise>
      <footer className="mt-20 border-t border-ink/10 pt-10 text-center">
        <Logotype t={t * 1.2} start={0.6} size={28} style={{ display: 'inline-block' }} />
        <p className="mt-6 font-bold">Esteban Muñoz Malavé — Founder & Estratega de Marca</p>
        <p className="mt-2 text-ink/70">
          <a className="underline-offset-4 hover:underline" href="mailto:esteban.munoz@boldagencycr.com">
            esteban.munoz@boldagencycr.com
          </a>{' '}
          ·{' '}
          <a className="underline-offset-4 hover:underline" href="https://boldagencycr.com/portafolio" target="_blank" rel="noopener noreferrer">
            boldagencycr.com/portafolio
          </a>
        </p>
        <p className="mt-8 text-xs text-ink/65">{CREDITOS}</p>
      </footer>
    </Section>
  );
}

