import { describe, it, expect } from 'vitest';
import { getEmbeddedFontCss } from '../lib/fonts';
import { generateHighResGraphic } from '../lib/image-processor';
import sharp from 'sharp';

describe('Font Embedding & Graphic Export', () => {
  it('should generate embedded Base64 font CSS for Cormorant Garamond, IBM Plex Mono, and Oswald', () => {
    const css = getEmbeddedFontCss();
    expect(css).toContain('font-family: \'Cormorant Garamond\'');
    expect(css).toContain('font-family: \'IBM Plex Mono\'');
    expect(css).toContain('font-family: \'Oswald\'');
    expect(css).toContain('data:font/ttf;charset=utf-8;base64,');
  });

  it('should render a pixel-perfect high-res PNG pass without throwing on test characters', async () => {
    // Create dummy 100x100 white PNG buffer for photo input
    const samplePhotoBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const testBuilderInfo = {
      name: 'John Doe ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz',
      role: 'React Developer !@#$%^&*()_+-=[]{};:\'",.<>/?',
      builderTitle: 'AI Builder 1234567890',
      company: 'HH Goa 2026',
      location: 'Goa, India',
      customHashtag: '#FrameInGoa',
    };

    const resultBuffer = await generateHighResGraphic({
      userImageBuffer: samplePhotoBuffer,
      builderInfo: testBuilderInfo,
      cropConfig: { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
      exportOptions: {
        resolution: '1080x1080',
        transparentBg: false,
        themeId: 'hhgoa-editorial',
        graphicType: 'card',
      },
      shareUrl: 'https://hhgoa2026.vercel.app/card/test-123',
    });

    expect(resultBuffer).toBeInstanceOf(Buffer);
    expect(resultBuffer.length).toBeGreaterThan(1000);

    const metadata = await sharp(resultBuffer).metadata();
    expect(metadata.format).toBe('png');
    expect(metadata.width).toBe(1080);
    expect(metadata.height).toBe(1080);
  });

  it('should render a high-res profile frame PNG without error', async () => {
    const samplePhotoBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 200, g: 100, b: 50, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const resultBuffer = await generateHighResGraphic({
      userImageBuffer: samplePhotoBuffer,
      builderInfo: {
        name: 'Jane Doe',
        role: 'Full Stack Engineer',
        builderTitle: 'The AI Architect',
        company: 'Dev Studio',
        location: 'Goa, India',
        customHashtag: '#FrameInGoa',
      },
      cropConfig: { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
      exportOptions: {
        resolution: '2048x2048',
        transparentBg: true,
        themeId: 'hhgoa-editorial',
        graphicType: 'frame',
      },
      shareUrl: 'https://hhgoa2026.vercel.app/frame/test-456',
    });

    expect(resultBuffer).toBeInstanceOf(Buffer);
    const metadata = await sharp(resultBuffer).metadata();
    expect(metadata.format).toBe('png');
    expect(metadata.width).toBe(2048);
    expect(metadata.height).toBe(2048);
  });
});
