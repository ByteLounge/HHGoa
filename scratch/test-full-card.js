import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { generateHighResGraphic } from '../src/lib/image-processor.js';
import { DEFAULT_BUILDER_INFO } from '../src/lib/constants.js';

async function testCardGeneration() {
  // Create a 400x400 dummy user photo
  const dummyPhoto = await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 4,
      background: { r: 255, g: 0, b: 122, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const pngBuffer = await generateHighResGraphic({
    userImageBuffer: dummyPhoto,
    builderInfo: DEFAULT_BUILDER_INFO,
    cropConfig: { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
    exportOptions: {
      resolution: '1080x1080',
      transparentBg: false,
      themeId: 'hhgoa-editorial',
      graphicType: 'card',
    },
    shareUrl: 'https://hhgoa2026.vercel.app/card/test1234',
  });

  const outputPath = path.join(process.cwd(), 'scratch', 'test-pass.png');
  fs.writeFileSync(outputPath, pngBuffer);
  console.log('Saved card generation output to:', outputPath);

  const framePngBuffer = await generateHighResGraphic({
    userImageBuffer: dummyPhoto,
    builderInfo: DEFAULT_BUILDER_INFO,
    cropConfig: { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
    exportOptions: {
      resolution: '1080x1080',
      transparentBg: false,
      themeId: 'hhgoa-editorial',
      graphicType: 'frame',
    },
    shareUrl: 'https://hhgoa2026.vercel.app/frame/test1234',
  });

  const frameOutputPath = path.join(process.cwd(), 'scratch', 'test-frame.png');
  fs.writeFileSync(frameOutputPath, framePngBuffer);
  console.log('Saved frame generation output to:', frameOutputPath);
}

testCardGeneration().catch(console.error);
