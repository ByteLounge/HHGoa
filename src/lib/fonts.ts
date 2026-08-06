import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

let cachedEmbeddedFontCss: string | null = null;

/**
 * Reads local TTF font files and converts them into embedded Base64 @font-face CSS rules.
 * This guarantees that server-side SVG image renderers (Sharp/librsvg) and client-side canvas
 * have full access to font glyphs without reliance on OS system fonts or external CDNs.
 */
export function getEmbeddedFontCss(): string {
  if (cachedEmbeddedFontCss) {
    return cachedEmbeddedFontCss;
  }

  const fontsDir = path.join(process.cwd(), 'public', 'fonts');

  const fontFiles = [
    { name: 'Cormorant Garamond', weight: 400, file: 'cormorant-garamond-400.ttf', style: 'normal' },
    { name: 'Cormorant Garamond', weight: 600, file: 'cormorant-garamond-600.ttf', style: 'normal' },
    { name: 'Cormorant Garamond', weight: 700, file: 'cormorant-garamond-700.ttf', style: 'normal' },
    { name: 'IBM Plex Mono', weight: 400, file: 'ibm-plex-mono-400.ttf', style: 'normal' },
    { name: 'IBM Plex Mono', weight: 500, file: 'ibm-plex-mono-500.ttf', style: 'normal' },
    { name: 'IBM Plex Mono', weight: 600, file: 'ibm-plex-mono-600.ttf', style: 'normal' },
    { name: 'IBM Plex Mono', weight: 700, file: 'ibm-plex-mono-700.ttf', style: 'normal' },
    { name: 'Oswald', weight: 500, file: 'oswald-500.ttf', style: 'normal' },
    { name: 'Oswald', weight: 600, file: 'oswald-600.ttf', style: 'normal' },
    { name: 'Oswald', weight: 700, file: 'oswald-700.ttf', style: 'normal' },
  ];

  const cssRules: string[] = [];

  for (const font of fontFiles) {
    const filePath = path.join(fontsDir, font.file);
    if (fs.existsSync(filePath)) {
      const normalizedPath = filePath.replace(/\\/g, '/');
      const buffer = fs.readFileSync(filePath);
      const base64 = buffer.toString('base64');
      cssRules.push(`
        @font-face {
          font-family: '${font.name}';
          font-style: ${font.style};
          font-weight: ${font.weight};
          src: url('file:///${normalizedPath}') format('truetype'),
               url('data:font/ttf;charset=utf-8;base64,${base64}') format('truetype');
        }
      `);
    }
  }

  cachedEmbeddedFontCss = cssRules.join('\n');
  return cachedEmbeddedFontCss;
}

let cachedFontBuffers: Buffer[] | null = null;

export function getFontBuffers(): Buffer[] {
  if (cachedFontBuffers) return cachedFontBuffers;

  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  const files = [
    'cormorant-garamond-400.ttf',
    'cormorant-garamond-600.ttf',
    'cormorant-garamond-700.ttf',
    'ibm-plex-mono-400.ttf',
    'ibm-plex-mono-500.ttf',
    'ibm-plex-mono-600.ttf',
    'ibm-plex-mono-700.ttf',
    'oswald-500.ttf',
    'oswald-600.ttf',
    'oswald-700.ttf',
  ];

  const buffers: Buffer[] = [];
  for (const file of files) {
    const filePath = path.join(fontsDir, file);
    if (fs.existsSync(filePath)) {
      buffers.push(fs.readFileSync(filePath));
    }
  }

  cachedFontBuffers = buffers;
  return cachedFontBuffers;
}

export function renderSvgWithResvg(svgString: string, width: number): Buffer {
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  const resvg = new Resvg(svgString, {
    font: {
      fontDirs: [fontsDir],
      defaultFontFamily: 'IBM Plex Mono',
    },
    fitTo: {
      mode: 'width',
      value: width,
    },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}
