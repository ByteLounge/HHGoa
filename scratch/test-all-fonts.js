const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts').replace(/\\/g, '/');

const svgFile = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Cormorant Garamond';
        font-weight: 700;
        font-style: normal;
        src: url('file:///${fontsDir}/cormorant-garamond-700.ttf');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-weight: 700;
        font-style: normal;
        src: url('file:///${fontsDir}/ibm-plex-mono-700.ttf');
      }
      @font-face {
        font-family: 'Oswald';
        font-weight: 700;
        font-style: normal;
        src: url('file:///${fontsDir}/oswald-700.ttf');
      }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#0E6B3A"/>
  <text x="50" y="100" font-family="'Cormorant Garamond'" font-weight="700" font-size="48" fill="#FFD400">John Doe - HH Goa 2026</text>
  <text x="50" y="200" font-family="'IBM Plex Mono'" font-weight="700" font-size="32" fill="#F7F1DF">#FrameInGoa !@#$%^&amp;*()_+-=[]{};:'",.&lt;&gt;/? 1234567890</text>
  <text x="50" y="300" font-family="'Oswald'" font-weight="700" font-size="40" fill="#FF007A">BUILDER PASS CREDENTIAL</text>
</svg>`;

async function testAllFonts() {
  const buf = await sharp(Buffer.from(svgFile)).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, 'out-allfonts.png'), buf);
  console.log('Successfully rendered out-allfonts.png, size:', buf.length);
}

testAllFonts().catch(console.error);
