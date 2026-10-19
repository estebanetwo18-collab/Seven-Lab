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
| `sevenlab-pitch.mp4` | 1920×1080, 60 fps, H.264, CRF 18, 46 s, con audio (~12 MB) |
| `sevenlab-pitch-vertical.mp4` | 1080×1920 para WhatsApp/Instagram (~12 MB) |
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

## Audio: voz en off, música y efectos

El video ya trae banda sonora (`public/audio/banda-sonora.mp3`, −14 LUFS):

| Pieza | Fuente | Licencia |
|---|---|---|
| Música | "Motivating Mornings" — Ahjay Stelino (Mixkit, Corporate, 123 BPM) | Mixkit Stock Music Free License: uso comercial gratis, sin atribución obligatoria |
| Voz en off | Voz neural es-CR-JuanNeural (Microsoft Edge TTS) | Ver nota abajo |
| Efectos | Whoosh, clics, tipeo y "select" de Mixkit | Mixkit Sound Effects Free License |

La música arranca desde el segundo 4,44 de la canción para que el *drop* caiga
justo en el corte al montaje de fotos (7,5 s). Los cortes de escena se ajustan
solos al beat (`video/beats.json`).

Para regenerar todo:

```bash
pip install edge-tts numpy librosa
python video/voz.py        # voz frase por frase → assets/audio/voz/ (guion en guion.tsv)
python video/mezcla.py     # mezcla con ducking → public/audio/ y video/beats.json
npm run video:render
```

- **Cambiar el texto o la voz:** editá `assets/audio/voz/guion.tsv` (id, segundo de inicio, duración máxima, velocidad, texto).
  Otra voz: `python video/voz.py es-CR-MariaNeural`. Palabras en inglés se escriben como se pronuncian ("lándin péich").
- **Usar una voz de ElevenLabs:** exportá cada frase como `assets/audio/voz/<id>.wav` (mismos ids) y corré solo `python video/mezcla.py`.
- **Niveles:** `MUSIC_GAIN_DB`, `DUCK_DB`, `VOICE_GAIN_DB` y la lista `SFX` al inicio de `video/mezcla.py`.
- **Quitar el audio:** `HAS_SOUNDTRACK = false` en `video/timeline.ts` y `VIDEO_HAS_AUDIO = false` en `src/landing/videoConfig.ts`.

**Nota sobre la voz:** la voz sale del servicio de lectura en voz alta de
Microsoft Edge, que sirve muy bien para presentar la propuesta, pero no trae
una licencia comercial explícita. Si el video se va a usar como anuncio
público, generá las mismas frases con Azure Speech (la misma voz,
con licencia comercial) o con ElevenLabs.

## Publicar

**Vercel:** importá el repo; `vercel.json` ya define build (`npm run build`) y salida (`dist`).
O con la CLI: `npx vercel --prod`.

**Netlify:** importá el repo; `netlify.toml` ya define build y salida.
O arrastrá la carpeta `dist/` a app.netlify.com/drop.

Los videos están en `public/video/` y se copian a `dist/` en el build.

## Fuentes y créditos

- Textos y cifras: `assets/SevenLab_Propuesta_BOLD_Agency_v6.pptx` y el brief.
- Fotos: Instagram @sevenlab7 · @recuerdos_fullframe (extraídas del PPTX, en `assets/fotos/`).
- Música y efectos: Mixkit (licencias gratuitas de uso comercial). Voz: Microsoft Edge TTS, es-CR-JuanNeural.
- Tipografía: Manrope (SIL OFL, autohospedada vía @fontsource). Manrope no trae el signo
  "₡": se agregó un subset de Inter Display (SIL OFL) solo con ese glifo (`src/shared/fonts/`).
- Análisis del video de referencia: `docs/analisis-referencia.md`.

## Licencia de Remotion

Remotion es gratis para personas y empresas de **hasta 3 empleados**. Si BOLD
Agency tiene 4 o más personas, necesita una *Company License*:
https://www.remotion.dev/license — revisalo antes de usarlo comercialmente.
