const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');

function getEmbeddedFontCss() {
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

  return fontFiles.map(font => {
    const filePath = path.join(fontsDir, font.file);
    const buffer = fs.readFileSync(filePath);
    return `
      @font-face {
        font-family: '${font.name}';
        font-style: ${font.style};
        font-weight: ${font.weight};
        src: url('data:font/ttf;charset=utf-8;base64,${buffer.toString('base64')}') format('truetype');
      }
    `;
  }).join('\n');
}

const fontsCss = getEmbeddedFontCss();

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      ${fontsCss}
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#0E6B3A"/>
  <text x="50" y="100" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="48" fill="#FFD400">John Doe - HH Goa 2026</text>
  <text x="50" y="200" font-family="'IBM Plex Mono', monospace" font-weight="700" font-size="36" fill="#F7F1DF">#FrameInGoa !@#$%^&amp;*()_+-=[]{};:'",.&lt;&gt;/?</text>
  <text x="50" y="300" font-family="'Oswald', sans-serif" font-weight="700" font-size="40" fill="#FF007A">BUILDER PASS CREDENTIAL 1234567890</text>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(__dirname, 'test-output.png'))
  .then((info) => {
    console.log('Rendered successfully:', info);
  })
  .catch((err) => {
    console.error('Render error:', err);
  });
