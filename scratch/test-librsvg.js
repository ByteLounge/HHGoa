const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
const fontPath = path.join(fontsDir, 'cormorant-garamond-700.ttf');
const fontBuffer = fs.readFileSync(fontPath);
const fontBase64 = fontBuffer.toString('base64');

// Test 1: data URI @font-face
const svgDataUri = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Cormorant Garamond';
        src: url('data:font/ttf;charset=utf-8;base64,${fontBase64}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#0E6B3A"/>
  <text x="30" y="100" font-family="'Cormorant Garamond'" font-size="40" fill="#FFD400">TEST DATA URI FONT</text>
</svg>`;

// Test 2: file path @font-face
const absoluteFontPath = fontPath.replace(/\\/g, '/');
const svgFilePath = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Cormorant Garamond';
        src: url('file:///${absoluteFontPath}');
        font-weight: 700;
        font-style: normal;
      }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#0E6B3A"/>
  <text x="30" y="100" font-family="'Cormorant Garamond'" font-size="40" fill="#FFD400">TEST FILE PATH FONT</text>
</svg>`;

async function runTest() {
  const buf1 = await sharp(Buffer.from(svgDataUri)).png().toBuffer();
  const buf2 = await sharp(Buffer.from(svgFilePath)).png().toBuffer();
  
  fs.writeFileSync(path.join(__dirname, 'out-datauri.png'), buf1);
  fs.writeFileSync(path.join(__dirname, 'out-filepath.png'), buf2);

  console.log('buf1 size:', buf1.length);
  console.log('buf2 size:', buf2.length);
  console.log('Are buffers identical?', buf1.equals(buf2));
}

runTest().catch(console.error);
