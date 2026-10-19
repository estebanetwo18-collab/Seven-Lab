import { Config } from '@remotion/cli/config';

// En este contenedor ya hay un Chromium headless; en otra máquina Remotion descarga el suyo.
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
