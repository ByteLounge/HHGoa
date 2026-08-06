const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');

// Load font buffers directly into memory
const cormorant400 = fs.readFileSync(path.join(fontsDir, 'cormorant-garamond-400.ttf'));
const cormorant600 = fs.readFileSync(path.join(fontsDir, 'cormorant-garamond-600.ttf'));
const cormorant700 = fs.readFileSync(path.join(fontsDir, 'cormorant-garamond-700.ttf'));
const ibmMono400 = fs.readFileSync(path.join(fontsDir, 'ibm-plex-mono-400.ttf'));
const ibmMono500 = fs.readFileSync(path.join(fontsDir, 'ibm-plex-mono-500.ttf'));
const ibmMono600 = fs.readFileSync(path.join(fontsDir, 'ibm-plex-mono-600.ttf'));
const ibmMono700 = fs.readFileSync(path.join(fontsDir, 'ibm-plex-mono-700.ttf'));
const oswald500 = fs.readFileSync(path.join(fontsDir, 'oswald-500.ttf'));
const oswald600 = fs.readFileSync(path.join(fontsDir, 'oswald-600.ttf'));
const oswald700 = fs.readFileSync(path.join(fontsDir, 'oswald-700.ttf'));

const testSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="#0E6B3A"/>
  <rect x="75" y="54" width="930" height="972" rx="38" fill="#F7F1DF" stroke="#1E5A3B" stroke-width="5" />
  
  <text x="140" y="140" font-family="Cormorant Garamond" font-weight="700" font-size="43" fill="#0A4C2B">HH GOA 2026</text>
  <text x="560" y="300" font-family="Cormorant Garamond" font-weight="700" font-size="48" fill="#0A4C2B">John Doe</text>
  <text x="560" y="350" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="#FF007A">React Developer</text>
  <text x="560" y="400" font-family="IBM Plex Mono" font-weight="500" font-size="23" fill="#0E6B3A">HH Goa Studio</text>
  <text x="560" y="440" font-family="IBM Plex Mono" font-weight="500" font-size="19" fill="#0E6B3A">Goa, India</text>
  <text x="140" y="860" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="#0A4C2B">28-31 OCT 2026 | GOA, INDIA</text>
  <text x="140" y="910" font-family="IBM Plex Mono" font-weight="700" font-size="24" fill="#FF007A">#FrameInGoa !@#$%^&amp;*()_+-=[]{};:'",.&lt;&gt;/?</text>
</svg>`;

async function testResvgRender() {
  const resvg = new Resvg(testSvg, {
    font: {
      fontBuffers: [
        cormorant400,
        cormorant600,
        cormorant700,
        ibmMono400,
        ibmMono500,
        ibmMono600,
        ibmMono700,
        oswald500,
        oswald600,
        oswald700,
      ],
      defaultFontFamily: 'IBM Plex Mono',
    },
    fitTo: {
      mode: 'width',
      value: 1080,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  
  fs.writeFileSync(path.join(__dirname, 'resvg-out.png'), pngBuffer);
  console.log('Resvg render complete! Buffer size:', pngBuffer.length);
}

testResvgRender().catch(console.error);
