// Renderiza el video horizontal, el vertical y el póster.
//   node video/render.mjs              → todo
//   node video/render.mjs horizontal   → solo 1920×1080
//   node video/render.mjs vertical     → solo 1080×1920
//   node video/render.mjs poster       → solo pósters
// Variables: CRF (por defecto 18), REMOTION_CHROME (ruta a un Chromium ya instalado).
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (f) => path.join(root, 'public', 'video', f);
const which = process.argv[2] ?? 'all';
const crf = Number(process.env.CRF ?? 18);

const localChrome = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = process.env.REMOTION_CHROME ?? (existsSync(localChrome) ? localChrome : null);

console.log('Empaquetando…');
const serveUrl = await bundle({
  entryPoint: path.join(root, 'video', 'index.ts'),
  publicDir: path.join(root, 'public'),
});

const mb = (f) => (statSync(f).size / 1024 / 1024).toFixed(1) + ' MB';

async function video(id, file) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  console.log(`Renderizando ${id} (${composition.width}×${composition.height}, ${composition.durationInFrames} cuadros)…`);
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    crf,
    x264Preset: 'slow',
    pixelFormat: 'yuv420p',
    imageFormat: 'jpeg',
    jpegQuality: 92,
    browserExecutable,
    outputLocation: out(file),
    timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 20);
      if (p !== last) {
        last = p;
        process.stdout.write(`  ${Math.round(progress * 100)}%\n`);
      }
    },
  });
  console.log(`  → ${file} (${mb(out(file))})`);
}

async function poster(id, frame, file) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  await renderStill({ composition, serveUrl, frame, output: out(file), imageFormat: 'jpeg', jpegQuality: 82, browserExecutable });
  console.log(`  → ${file} (${mb(out(file))})`);
}

// Cuadro del póster: la franja con "Fuerza. Comunidad. Fisio. Lagunilla." ya revelada (5,1 s).
const POSTER_FRAME = Math.round((5.1 / 0.8) * 60); // franja con la frase ya revelada

if (which === 'all' || which === 'horizontal') await video('SevenLabPitch', 'sevenlab-pitch.mp4');
if (which === 'all' || which === 'vertical') await video('SevenLabPitchVertical', 'sevenlab-pitch-vertical.mp4');
if (which === 'all' || which === 'poster') {
  await poster('SevenLabPitch', POSTER_FRAME, 'poster.jpg');
  await poster('SevenLabPitchVertical', POSTER_FRAME, 'poster-vertical.jpg');
}
