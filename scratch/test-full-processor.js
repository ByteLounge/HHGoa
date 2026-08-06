const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// We test loading public/fonts directly and rendering with Sharp
const fontsDir = path.join(__dirname, '..', 'public', 'fonts').replace(/\\/g, '/');

const testSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Cormorant Garamond';
        font-style: normal;
        font-weight: 700;
        src: url('file:///${fontsDir}/cormorant-garamond-700.ttf') format('truetype');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-style: normal;
        font-weight: 700;
        src: url('file:///${fontsDir}/ibm-plex-mono-700.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Oswald';
        font-style: normal;
        font-weight: 700;
        src: url('file:///${fontsDir}/oswald-700.ttf') format('truetype');
      }
    </style>
  </defs>

  <rect width="1080" height="1080" fill="#0E6B3A"/>
  
  <text x="100" y="200" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="64" fill="#FFD400">John Doe</text>
  <text x="100" y="320" font-family="'Oswald', sans-serif" font-weight="700" font-size="48" fill="#FFFFFF">BUILDER PASS CREDENTIAL</text>
  <text x="100" y="440" font-family="'IBM Plex Mono', monospace" font-weight="700" font-size="36" fill="#FF007A">React Developer • AI Architect</text>
  <text x="100" y="560" font-family="'IBM Plex Mono', monospace" font-weight="700" font-size="32" fill="#F7F1DF">#FrameInGoa 1234567890 !@#$%^&amp;*()_+-=[]{};:'",.&lt;&gt;/?</text>
</svg>`;

async function testFull() {
  const buf = await sharp(Buffer.from(testSvg)).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, 'out-full.png'), buf);
  console.log('Full rendering test successful! Buffer size:', buf.length);
}

testFull().catch(console.error);
