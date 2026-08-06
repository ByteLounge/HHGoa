import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function testSharpFonts() {
  const svg = `
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="200" fill="#0E6B3A" />
    <text x="20" y="40" font-family="Arial" font-size="20" fill="#FFD400">Arial: HH GOA 2026</text>
    <text x="20" y="80" font-family="Segoe UI" font-size="20" fill="#F7F1DF">Segoe UI: Alex Rivera</text>
    <text x="20" y="120" font-family="Courier New" font-size="20" fill="#FF007A">Courier New: Full Stack</text>
    <text x="20" y="160" font-family="sans-serif" font-size="20" fill="#FFFFFF">sans-serif: Test Text 123</text>
  </svg>
  `;

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(process.cwd(), 'scratch', 'test-fonts.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Saved test rendering to:', outputPath);
}

testSharpFonts().catch(console.error);
