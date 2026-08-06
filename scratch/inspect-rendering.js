const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Test 3: NO @font-face (Fallback to system sans-serif)
const svgNoFont = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0E6B3A"/>
  <text x="30" y="100" font-family="sans-serif" font-size="40" fill="#FFD400">TEST DATA URI FONT</text>
</svg>`;

async function check() {
  const bufNoFont = await sharp(Buffer.from(svgNoFont)).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, 'out-nofont.png'), bufNoFont);
  
  const bufDataUri = fs.readFileSync(path.join(__dirname, 'out-datauri.png'));
  const bufFilePath = fs.readFileSync(path.join(__dirname, 'out-filepath.png'));

  console.log('NoFont buffer size:', bufNoFont.length);
  console.log('DataUri buffer size:', bufDataUri.length);
  console.log('FilePath buffer size:', bufFilePath.length);

  console.log('DataUri equals NoFont?', bufDataUri.equals(bufNoFont));
  console.log('FilePath equals NoFont?', bufFilePath.equals(bufNoFont));
}

check().catch(console.error);
