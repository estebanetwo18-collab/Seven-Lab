# SevenLab × BOLD Agency — Propuesta estratégica

Landing de una sola página con la propuesta comercial de BOLD Agency para
SevenLab (box de entrenamiento funcional en Lagunilla, Heredia) y el video de
presentación de 36 s que vive en el hero.

- **Landing:** Vite + React + TypeScript + Tailwind + Framer Motion. Sitio estático.
- **Video:** Remotion, en `/video`, usando **los mismos componentes** de texto,
  tarjetas, teléfono y logo que la landing (`src/shared/`).
- Es una propuesta privada: lleva `noindex` (meta, `robots.txt` y cabecera `X-Robots-Tag`).

## Requisitos

- Node 18 o superior (probado con Node 22).
- Para renderizar el video: Remotion descarga su propio Chrome la primera vez.
  Si ya tenés uno, pasalo con `REMOTION_CHROME=/ruta/al/chrome`.

```bash
npm install
```

## Correr la landing

```bash
npm run dev       # http://localhost:5173
npm run build     # genera dist/ (sitio estático)
npm run preview   # sirve dist/ para probar el build
```

## Editar y renderizar el video

```bash
npm run video:studio     # editor visual de Remotion (vista previa en vivo)
npm run video:render     # horizontal + vertical + pósters
npm run video:render:h   # solo 1920×1080
npm run video:render:v   # solo 1080×1920
```

Salidas en `public/video/`:

| Archivo | Qué es |
|---|---|
| `sevenlab-pitch.mp4` | 1920×1080, 60 fps, H.264, CRF 18, 45 s (~10 MB) |
| `sevenlab-pitch-vertical.mp4` | 1080×1920 para WhatsApp/Instagram (~11 MB) |
| `poster.jpg` / `poster-vertical.jpg` | Pósters del hero |

Para bajar el peso: `CRF=22 npm run video:render`.

Cuadros sueltos para revisar sin renderizar todo:
`node video/stills.mjs SevenLabPitch 5.1 18.5 29` (quedan en `video/.stills/`).

### Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Duración, orden de escenas y velocidad (`SPEED`) | `video/timeline.ts` |
| Escenas 1–7 / 8–15 | `video/scenes/part1.tsx` / `part2.tsx` |
| Textos fijos, precio, paleta, chat, paquete | `src/shared/tokens.ts` |
| Revelado por palabra / letra, línea, contador | `src/shared/Text.tsx` |
| Post de Instagram, teléfono, navegador, tarjetas, logo | `src/shared/Mockups.tsx` |
| Curvas (expo-out, resorte) | `src/shared/motion.ts` |
| Secciones de la landing | `src/landing/Sections.tsx`, `src/landing/Hero.tsx` |

Los componentes compartidos son funciones del tiempo `t` (segundos): en el
video `t` sale del cuadro actual; en la landing, de un reloj que arranca cuando
la sección entra en pantalla (`useClock`). Con `prefers-reduced-motion` la
landing muestra directamente el estado final y el video no se reproduce solo.

## Voz en off

El texto está en `docs/voz-en-off.md`, cronometrado con el video. Cuando tengas
el MP3 de ElevenLabs: guardalo como `public/voz.mp3`, poné `HAS_VOICE = true`
en `video/timeline.ts`, `VIDEO_HAS_AUDIO = true` en `src/landing/videoConfig.ts`
y volvé a renderizar.

## Agregar música (opcional)

Hoy el video **no tiene audio** (no venía `music.mp3`). Para sumarla:

1. Poné la pista libre de derechos en `assets/music.mp3`.
2. `pip install librosa && python video/beats.py` → crea `video/beats.json` y copia la música a `public/music.mp3`.
3. `npm run video:render` → los cortes se ajustan solos al beat más cercano (±0,15 s) y el audio se incluye.
4. En `src/landing/videoConfig.ts` poné `VIDEO_HAS_AUDIO = true` para mostrar el botón **Activar sonido**.

## Publicar

**Vercel:** importá el repo; `vercel.json` ya define build (`npm run build`) y salida (`dist`).
O con la CLI: `npx vercel --prod`.

**Netlify:** importá el repo; `netlify.toml` ya define build y salida.
O arrastrá la carpeta `dist/` a app.netlify.com/drop.

Los videos están en `public/video/` y se copian a `dist/` en el build.

## Fuentes y créditos

- Textos y cifras: `assets/SevenLab_Propuesta_BOLD_Agency_v6.pptx` y el brief.
- Fotos: Instagram @sevenlab7 · @recuerdos_fullframe (extraídas del PPTX, en `assets/fotos/`).
- Tipografía: Manrope (SIL OFL, autohospedada vía @fontsource). Manrope no trae el signo
  "₡": se agregó un subset de Inter Display (SIL OFL) solo con ese glifo (`src/shared/fonts/`).
- Análisis del video de referencia: `docs/analisis-referencia.md`.

## Licencia de Remotion

Remotion es gratis para personas y empresas de **hasta 3 empleados**. Si BOLD
Agency tiene 4 o más personas, necesita una *Company License*:
https://www.remotion.dev/license — revisalo antes de usarlo comercialmente.
