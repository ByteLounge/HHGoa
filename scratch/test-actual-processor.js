const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Register ts-node / import compiled or require directly
// Let's create a test input for generateHighResGraphic
async function testActualProcessor() {
  const samplePhoto = await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 4,
      background: { r: 255, g: 200, b: 150, alpha: 1 },
    },
  }).png().toBuffer();

  // Load fonts helper
  const fontsDir = path.join(__dirname, '..', 'public', 'fonts').replace(/\\/g, '/');

  const fontCss = `
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
  `;

  const builderInfo = {
    name: 'John Doe',
    role: 'React Developer',
    builderTitle: 'AI Builder',
    company: 'HH Goa 2026',
    location: 'Goa, India',
    customHashtag: '#FrameInGoa',
  };

  const dimension = 1080;
  const nameText = builderInfo.name;
  const roleText = builderInfo.role;
  const titleText = builderInfo.builderTitle;
  const companyText = builderInfo.company;
  const locationText = builderInfo.location;
  const hashtagText = builderInfo.customHashtag;

  const cardSvgOverlay = `
  <svg width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${fontCss}
      </style>
    </defs>

    <rect width="${dimension}" height="${dimension}" fill="#0E6B3A" />
    
    <g transform="translate(75, 54)">
      <rect width="930" height="972" rx="38" fill="#F7F1DF" stroke="#1E5A3B" stroke-width="5" />
      <text x="65" y="88" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="43" fill="#0A4C2B">HH GOA 2026</text>
      <text x="492" y="240" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="43" fill="#0A4C2B">${nameText}</text>
      <text x="492" y="290" font-family="'IBM Plex Mono', monospace" font-weight="700" font-size="26" fill="#FF007A">${roleText}</text>
      <text x="492" y="340" font-family="'IBM Plex Mono', monospace" font-weight="500" font-size="23" fill="#0E6B3A">${companyText}</text>
      <text x="492" y="390" font-family="'IBM Plex Mono', monospace" font-weight="500" font-size="19" fill="#0E6B3A">${locationText}</text>
      <text x="65" y="810" font-family="'IBM Plex Mono', monospace" font-weight="700" font-size="26" fill="#0A4C2B">28-31 OCT 2026 | GOA, INDIA</text>
      <text x="65" y="860" font-family="'IBM Plex Mono', monospace" font-weight="700" font-size="24" fill="#FF007A">${hashtagText}</text>
    </g>
  </svg>
  `;

  const outputBuffer = await sharp(Buffer.from(cardSvgOverlay)).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, 'actual-test-card.png'), outputBuffer);
  console.log('Saved actual-test-card.png, size:', outputBuffer.length);
}

testActualProcessor().catch(console.error);
