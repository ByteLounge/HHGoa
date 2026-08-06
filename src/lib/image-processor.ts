import sharp, { Sharp } from 'sharp';
import QRCode from 'qrcode';
import { BuilderInfo, ExportOptions, ImageCropConfig } from '@/types';
import { FRAME_THEMES } from './constants';

export interface ImageProcessingInput {
  userImageBuffer: Buffer;
  builderInfo: BuilderInfo;
  cropConfig?: ImageCropConfig;
  exportOptions: ExportOptions;
  shareUrl?: string;
}

/**
 * Escapes text for XML/SVG safety
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * High quality Sharp image composite generator
 */
export async function generateHighResGraphic({
  userImageBuffer,
  builderInfo,
  cropConfig = { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
  exportOptions,
  shareUrl = 'https://hhgoa2026.vercel.app',
}: ImageProcessingInput): Promise<Buffer> {
  const dimension = exportOptions.resolution === '2048x2048' ? 2048 : 1080;
  const theme = FRAME_THEMES[exportOptions.themeId] || FRAME_THEMES['hhgoa-editorial'];

  // Process user photo first with rotation, zoom, offset using fresh Sharp clone
  let userSharp = sharp(userImageBuffer);

  if (cropConfig.rotation && cropConfig.rotation !== 0) {
    userSharp = userSharp.rotate(cropConfig.rotation);
  }

  // Generate QR Code Buffer
  const qrDataUrl = await QRCode.toDataURL(shareUrl, {
    margin: 1,
    color: {
      dark: '#0A4C2B',
      light: '#00000000',
    },
    width: Math.round(dimension * 0.12),
  });
  const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  if (exportOptions.graphicType === 'frame') {
    return generateProfileFrameSharp({
      userSharp,
      cropConfig,
      builderInfo,
      theme,
      dimension,
      transparentBg: exportOptions.transparentBg,
    });
  } else {
    return generateBuilderCardSharp({
      userSharp,
      cropConfig,
      builderInfo,
      theme,
      dimension,
      qrBuffer,
    });
  }
}

/**
 * Helper to apply zoom & pan crop to a photo buffer using Sharp clone
 */
async function processPhotoCrop(
  userSharp: Sharp,
  targetWidth: number,
  targetHeight: number,
  cropConfig: ImageCropConfig
): Promise<Buffer> {
  const cloned = userSharp.clone();
  const metadata = await cloned.metadata();
  const origW = metadata.width || targetWidth;
  const origH = metadata.height || targetHeight;

  const zoom = Math.max(1, cropConfig.zoom || 1);
  const cropW = Math.round(origW / zoom);
  const cropH = Math.round(origH / zoom);

  const maxShiftX = (origW - cropW) / 2;
  const maxShiftY = (origH - cropH) / 2;

  const shiftX = (cropConfig.offsetX / 100) * maxShiftX;
  const shiftY = (cropConfig.offsetY / 100) * maxShiftY;

  const extractLeft = Math.max(0, Math.min(origW - cropW, Math.round((origW - cropW) / 2 - shiftX)));
  const extractTop = Math.max(0, Math.min(origH - cropH, Math.round((origH - cropH) / 2 - shiftY)));

  return userSharp
    .clone()
    .extract({
      left: extractLeft,
      top: extractTop,
      width: Math.min(cropW, origW - extractLeft),
      height: Math.min(cropH, origH - extractTop),
    })
    .resize(targetWidth, targetHeight, { fit: 'cover' })
    .ensureAlpha()
    .toBuffer();
}

/**
 * Profile Picture Frame Composite Renderer (HH Goa Editorial Frame)
 */
async function generateProfileFrameSharp({
  userSharp,
  cropConfig,
  builderInfo,
  theme,
  dimension,
  transparentBg,
}: {
  userSharp: Sharp;
  cropConfig: ImageCropConfig;
  builderInfo: BuilderInfo;
  theme: typeof FRAME_THEMES['hhgoa-editorial'];
  dimension: number;
  transparentBg: boolean;
}): Promise<Buffer> {
  const innerPhotoSize = Math.round(dimension * 0.68);
  const photoCenterX = Math.round(dimension / 2);
  const photoCenterY = Math.round(dimension * 0.42);
  const photoRadius = Math.round(innerPhotoSize / 2);

  const photoCroppedBuffer = await processPhotoCrop(
    userSharp,
    innerPhotoSize,
    innerPhotoSize,
    cropConfig
  );

  // Mask photo with alpha channel enabled
  const maskSvg = Buffer.from(`
    <svg width="${innerPhotoSize}" height="${innerPhotoSize}">
      <circle cx="${innerPhotoSize / 2}" cy="${innerPhotoSize / 2}" r="${innerPhotoSize / 2}" fill="#FFFFFF"/>
    </svg>
  `);

  const maskedPhoto = await sharp(photoCroppedBuffer)
    .ensureAlpha()
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const nameText = escapeXml(builderInfo.name || 'Alex Rivera');
  const roleText = escapeXml(builderInfo.role || 'Full Stack Engineer');
  const titleText = escapeXml(builderInfo.builderTitle || 'The AI Architect');
  const companyText = escapeXml(builderInfo.company || builderInfo.college || '2:47 PM Studio');
  const locationText = escapeXml(builderInfo.location || 'Goa, India');
  const hashtagText = escapeXml(builderInfo.customHashtag || '#FrameInGoa');

  const svgOverlay = `
  <svg width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="editorialDotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#FFD400" fill-opacity="0.25" />
      </pattern>
    </defs>

    <!-- Outer Decorative Ring Ring - Yellow & Pink Trim -->
    <circle cx="${photoCenterX}" cy="${photoCenterY}" r="${photoRadius}" 
      fill="none" stroke="#FF007A" stroke-width="${dimension * 0.018}"/>
    <circle cx="${photoCenterX}" cy="${photoCenterY}" r="${photoRadius + dimension * 0.02}" 
      fill="none" stroke="#FFD400" stroke-width="${dimension * 0.008}" stroke-dasharray="${dimension * 0.02} ${dimension * 0.01}"/>

    <!-- Top Badge Header -->
    <g transform="translate(${photoCenterX}, ${photoCenterY - photoRadius - dimension * 0.05})">
      <rect x="-${dimension * 0.18}" y="-${dimension * 0.035}" width="${dimension * 0.36}" height="${dimension * 0.07}" rx="${dimension * 0.035}" fill="#FFD400" stroke="#0A4C2B" stroke-width="${dimension * 0.004}"/>
      <text x="0" y="${dimension * 0.01}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.026}" fill="#0A4C2B" text-anchor="middle" letter-spacing="2">HH GOA 2026</text>
    </g>

    <!-- Bottom Branding Banner Card with Clean ASCII Characters -->
    <g transform="translate(${dimension * 0.08}, ${dimension * 0.72})">
      <rect width="${dimension * 0.84}" height="${dimension * 0.24}" rx="${dimension * 0.04}" fill="#0E6B3A" stroke="#0A4C2B" stroke-width="${dimension * 0.006}"/>
      
      <!-- Accent Dot & Header -->
      <circle cx="${dimension * 0.05}" cy="${dimension * 0.05}" r="${dimension * 0.012}" fill="#FFD400"/>
      <text x="${dimension * 0.08}" y="${dimension * 0.06}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.034}" fill="#FFD400" letter-spacing="1">HH GOA 2026</text>
      <text x="${dimension * 0.79}" y="${dimension * 0.06}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.022}" fill="#FF007A" text-anchor="end">28-31 OCT</text>

      <!-- Divider line -->
      <line x1="${dimension * 0.05}" y1="${dimension * 0.085}" x2="${dimension * 0.79}" y2="${dimension * 0.085}" stroke="#F7F1DF" stroke-opacity="0.3" stroke-width="2"/>

      <!-- User Full Name -->
      <text x="${dimension * 0.05}" y="${dimension * 0.13}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.036}" fill="#F7F1DF">${nameText}</text>
      
      <!-- Title & Role -->
      <text x="${dimension * 0.05}" y="${dimension * 0.165}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.022}" fill="#FFD400">${titleText} | ${roleText}</text>
      
      <!-- Organization, Location & Hashtag -->
      <text x="${dimension * 0.05}" y="${dimension * 0.20}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.018}" fill="#F7F1DF">${companyText} | ${locationText} (${hashtagText})</text>
    </g>
  </svg>
  `;

  const canvas = sharp({
    create: {
      width: dimension,
      height: dimension,
      channels: 4,
      background: transparentBg
        ? { r: 0, g: 0, b: 0, alpha: 0 }
        : { r: 14, g: 107, b: 58, alpha: 1 }, // #0E6B3A
    },
  });

  return canvas
    .composite([
      {
        input: maskedPhoto,
        top: Math.round(photoCenterY - photoRadius),
        left: Math.round(photoCenterX - photoRadius),
      },
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .png({ quality: 100 })
    .toBuffer();
}

/**
 * Builder ID Card Composite Renderer (HH Goa Editorial Printed Pass Style)
 */
async function generateBuilderCardSharp({
  userSharp,
  cropConfig,
  builderInfo,
  theme,
  dimension,
  qrBuffer,
}: {
  userSharp: Sharp;
  cropConfig: ImageCropConfig;
  builderInfo: BuilderInfo;
  theme: typeof FRAME_THEMES['hhgoa-editorial'];
  dimension: number;
  qrBuffer: Buffer;
}): Promise<Buffer> {
  const cardWidth = Math.round(dimension * 0.86);
  const cardHeight = Math.round(dimension * 0.90);
  const cardLeft = Math.round((dimension - cardWidth) / 2);
  const cardTop = Math.round((dimension - cardHeight) / 2);

  const photoSize = Math.round(cardWidth * 0.42);
  const photoLeft = Math.round(cardLeft + cardWidth * 0.07);
  const photoTop = Math.round(cardTop + cardHeight * 0.22);
  const photoCornerRadius = Math.round(photoSize * 0.10);

  const photoCroppedBuffer = await processPhotoCrop(
    userSharp,
    photoSize,
    photoSize,
    cropConfig
  );

  // Mask photo with rounded corners ensuring alpha transparency outside mask
  const photoMaskSvg = Buffer.from(`
    <svg width="${photoSize}" height="${photoSize}">
      <rect x="0" y="0" width="${photoSize}" height="${photoSize}" rx="${photoCornerRadius}" ry="${photoCornerRadius}" fill="#FFFFFF"/>
    </svg>
  `);

  const roundedPhoto = await sharp(photoCroppedBuffer)
    .ensureAlpha()
    .composite([{ input: photoMaskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const nameText = escapeXml(builderInfo.name || 'Alex Rivera');
  const roleText = escapeXml(builderInfo.role || 'Full Stack Engineer');
  const titleText = escapeXml(builderInfo.builderTitle || 'The AI Architect');
  const companyText = escapeXml(builderInfo.company || builderInfo.college || '2:47 PM Studio');
  const locationText = escapeXml(builderInfo.location || 'Goa, India');
  const hashtagText = escapeXml(builderInfo.customHashtag || '#FrameInGoa');

  // Exact theme colors
  const cardBgColor = theme.cardBg || '#F7F1DF';
  const textColor = theme.textColor || '#0A4C2B';
  const subtextColor = theme.subtextColor || '#0E6B3A';
  const primaryColor = theme.primaryColor || '#FFD400';
  const accentColor = theme.accentColor || '#FF007A';

  // Base card surface & details SVG with clean ASCII characters
  const cardSvgOverlay = `
  <svg width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="bgDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#FFD400" fill-opacity="0.2" />
      </pattern>
    </defs>

    <!-- Canvas Background -->
    <rect width="${dimension}" height="${dimension}" fill="#0E6B3A" />
    <rect width="${dimension}" height="${dimension}" fill="url(#bgDots)" />

    <!-- Main Card Body (Cream Surface with Offset Shadow) -->
    <g transform="translate(${cardLeft}, ${cardTop})">
      <!-- Offset Shadow -->
      <rect x="${dimension * 0.015}" y="${dimension * 0.015}" width="${cardWidth}" height="${cardHeight}" rx="${dimension * 0.035}" fill="#0A4C2B" />

      <!-- Card Base -->
      <rect width="${cardWidth}" height="${cardHeight}" rx="${dimension * 0.035}" fill="${cardBgColor}" stroke="#1E5A3B" stroke-width="${dimension * 0.005}" />

      <!-- Top Header Branding -->
      <text x="${cardWidth * 0.07}" y="${cardHeight * 0.09}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.04}" fill="${textColor}">HH GOA <tspan fill="${accentColor}" font-family="sans-serif" font-size="${dimension * 0.03}">2026</tspan></text>
      
      <!-- Top Right Badge -->
      <g transform="translate(${cardWidth * 0.65}, ${cardHeight * 0.045})">
        <rect width="${cardWidth * 0.28}" height="${cardHeight * 0.05}" rx="${cardHeight * 0.025}" fill="${primaryColor}" stroke="#0A4C2B" stroke-width="2" />
        <text x="${cardWidth * 0.14}" y="${cardHeight * 0.033}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.017}" fill="#0A4C2B" text-anchor="middle" letter-spacing="2">BUILDER PASS</text>
      </g>

      <!-- Top Divider -->
      <line x1="${cardWidth * 0.07}" y1="${cardHeight * 0.13}" x2="${cardWidth * 0.93}" y2="${cardHeight * 0.13}" stroke="#0A4C2B" stroke-width="2.5" />

      <!-- Photo Slot Background Fill -->
      <rect x="${cardWidth * 0.07}" y="${cardHeight * 0.22}" width="${photoSize}" height="${photoSize}" rx="${photoCornerRadius}" ry="${photoCornerRadius}" fill="#0E6B3A" />

      <!-- Right Column Info (Title Badge, Name, Stack, Org, Location) -->
      <g transform="translate(${cardWidth * 0.53}, ${cardHeight * 0.22})">
        <!-- Builder Title Badge -->
        <rect x="0" y="0" width="${cardWidth * 0.4}" height="${cardHeight * 0.045}" rx="${cardHeight * 0.012}" fill="${accentColor}" stroke="#0A4C2B" stroke-width="2" />
        <text x="${cardWidth * 0.03}" y="${cardHeight * 0.03}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.017}" fill="#FFFFFF">${titleText}</text>

        <!-- Name -->
        <text x="0" y="${cardHeight * 0.12}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.04}" fill="${textColor}">${nameText}</text>
        
        <!-- Role / Stack -->
        <text x="0" y="${cardHeight * 0.175}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.024}" fill="${accentColor}">${roleText}</text>

        <!-- Organization -->
        <text x="0" y="${cardHeight * 0.225}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.021}" fill="${subtextColor}">${companyText}</text>

        <!-- Location -->
        <text x="0" y="${cardHeight * 0.27}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.018}" fill="${subtextColor}">${locationText}</text>
      </g>

      <!-- Dashed Divider -->
      <line x1="${cardWidth * 0.07}" y1="${cardHeight * 0.72}" x2="${cardWidth * 0.93}" y2="${cardHeight * 0.72}" stroke="#0A4C2B" stroke-width="2.5" stroke-dasharray="8 6" />

      <!-- Footer Section: Event Info & Hashtag -->
      <g transform="translate(${cardWidth * 0.07}, ${cardHeight * 0.78})">
        <text x="0" y="0" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.024}" fill="${textColor}" letter-spacing="1">28-31 OCT 2026 | GOA, INDIA</text>
        <text x="0" y="${cardHeight * 0.055}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.022}" fill="${accentColor}">${hashtagText}</text>
        <text x="0" y="${cardHeight * 0.095}" font-family="sans-serif" font-weight="bold" font-size="${dimension * 0.016}" fill="${subtextColor}">Scan QR to verify official builder pass</text>
      </g>
    </g>
  </svg>
  `;

  // Photo border frame drawn ON TOP of the photo to seal edges cleanly
  const photoBorderFrameSvg = `
  <svg width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${photoLeft}" y="${photoTop}" width="${photoSize}" height="${photoSize}" rx="${photoCornerRadius}" ry="${photoCornerRadius}" fill="none" stroke="#0A4C2B" stroke-width="${Math.round(dimension * 0.007)}" />
  </svg>
  `;

  const canvas = sharp({
    create: {
      width: dimension,
      height: dimension,
      channels: 4,
      background: { r: 14, g: 107, b: 58, alpha: 1 }, // #0E6B3A
    },
  });

  const qrSize = Math.round(cardWidth * 0.16);
  const qrTop = Math.round(cardTop + cardHeight * 0.74);
  const qrLeft = Math.round(cardLeft + cardWidth * 0.75);

  const qrResized = await sharp(qrBuffer)
    .resize(qrSize, qrSize)
    .toBuffer();

  return canvas
    .composite([
      {
        input: Buffer.from(cardSvgOverlay),
        top: 0,
        left: 0,
      },
      {
        input: roundedPhoto,
        top: photoLeft ? photoTop : photoTop,
        left: photoLeft,
      },
      {
        input: Buffer.from(photoBorderFrameSvg),
        top: 0,
        left: 0,
      },
      {
        input: qrResized,
        top: qrTop,
        left: qrLeft,
      },
    ])
    .png({ quality: 100 })
    .toBuffer();
}
