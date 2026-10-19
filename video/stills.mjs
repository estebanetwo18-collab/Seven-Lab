// Saca cuadros sueltos para revisar sin renderizar todo: node video/stills.mjs SevenLabPitch 1.2 5.1 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id = 'SevenLabPitch', ...secs] = process.argv.slice(2);
const dir = process.env.OUT ?? path.join(root, 'video', '.stills');
mkdirSync(dir, { recursive: true });
const localChrome = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = process.env.REMOTION_CHROME ?? (existsSync(localChrome) ? localChrome : null);
const serveUrl = await bundle({ entryPoint: path.join(root, 'video', 'index.ts'), publicDir: path.join(root, 'public') });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * 60));
  const output = path.join(dir, `${id}-${s}.png`);
  await renderStill({ composition, serveUrl, frame, output, browserExecutable });
  console.log(output);
}
