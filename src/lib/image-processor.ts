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
  const theme = FRAME_THEMES[exportOptions.themeId] || FRAME_THEMES['goa-sunset'];

  // Process user photo first
  let userSharp = sharp(userImageBuffer);

  if (cropConfig.rotation && cropConfig.rotation !== 0) {
    userSharp = userSharp.rotate(cropConfig.rotation);
  }

  // Generate QR Code Buffer if needed
  const qrDataUrl = await QRCode.toDataURL(shareUrl, {
    margin: 1,
    color: {
      dark: '#FFFFFF',
      light: '#00000000',
    },
    width: Math.round(dimension * 0.1),
  });
  const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  if (exportOptions.graphicType === 'frame') {
    return generateProfileFrameSharp({
      userSharp,
      builderInfo,
      theme,
      dimension,
      transparentBg: exportOptions.transparentBg,
    });
  } else {
    return generateBuilderCardSharp({
      userSharp,
      builderInfo,
      theme,
      dimension,
      qrBuffer,
    });
  }
}

/**
 * Profile Picture Frame Composite Renderer
 */
async function generateProfileFrameSharp({
  userSharp,
  builderInfo,
  theme,
  dimension,
  transparentBg,
}: {
  userSharp: Sharp;
  builderInfo: BuilderInfo;
  theme: typeof FRAME_THEMES['goa-sunset'];
  dimension: number;
  transparentBg: boolean;
}): Promise<Buffer> {
  // Photo size & circle parameters inside 1080x1080 or 2048x2048 canvas
  const innerPhotoSize = Math.round(dimension * 0.72); // Central circle size
  const photoCenterX = Math.round(dimension / 2);
  const photoCenterY = Math.round(dimension * 0.45);
  const photoRadius = Math.round(innerPhotoSize / 2);

  // Resize user photo to innerPhotoSize
  const photoScaled = await userSharp
    .resize(innerPhotoSize, innerPhotoSize, {
      fit: 'cover',
      position: 'attention',
    })
    .toBuffer();

  // Create circular mask for user photo
  const maskSvg = Buffer.from(`
    <svg width="${innerPhotoSize}" height="${innerPhotoSize}">
      <circle cx="${innerPhotoSize / 2}" cy="${innerPhotoSize / 2}" r="${innerPhotoSize / 2}" fill="#fff"/>
    </svg>
  `);

  const maskedPhoto = await sharp(photoScaled)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .toBuffer();

  // Create SVG Frame Overlay
  const nameText = escapeXml(builderInfo.name || 'HH Goa 2026');
  const titleText = escapeXml(builderInfo.builderTitle || 'Official Builder');

  const svgOverlay = `
  <svg width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.primaryColor}" />
        <stop offset="100%" stop-color="${theme.accentColor}" />
      </linearGradient>
      <linearGradient id="darkBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0A0F1D" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#050811" stop-opacity="0.98" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${dimension * 0.015}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Decorative Ring -->
    <circle cx="${photoCenterX}" cy="${photoCenterY}" r="${photoRadius + dimension * 0.015}" 
      fill="none" stroke="url(#primaryGrad)" stroke-width="${dimension * 0.012}" filter="url(#glow)"/>

    <!-- Subtle Tech Circuit Accents around Circle -->
    <circle cx="${photoCenterX}" cy="${photoCenterY}" r="${photoRadius + dimension * 0.035}" 
      fill="none" stroke="${theme.primaryColor}" stroke-opacity="0.25" stroke-width="${dimension * 0.003}" stroke-dasharray="${dimension * 0.02} ${dimension * 0.01}"/>

    <!-- Top Badge Header -->
    <g transform="translate(${photoCenterX}, ${photoCenterY - photoRadius - dimension * 0.05})">
      <rect x="-${dimension * 0.18}" y="-${dimension * 0.035}" width="${dimension * 0.36}" height="${dimension * 0.07}" rx="${dimension * 0.035}" fill="url(#primaryGrad)"/>
      <text x="0" y="${dimension * 0.01}" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="${dimension * 0.026}" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">HH GOA 2026</text>
    </g>

    <!-- Bottom Branding Banner Card -->
    <g transform="translate(${dimension * 0.08}, ${dimension * 0.74})">
      <rect width="${dimension * 0.84}" height="${dimension * 0.21}" rx="${dimension * 0.03}" fill="url(#darkBgGrad)" stroke="url(#primaryGrad)" stroke-width="${dimension * 0.003}"/>
      
      <!-- Logo Accent Dot -->
      <circle cx="${dimension * 0.06}" cy="${dimension * 0.06}" r="${dimension * 0.015}" fill="${theme.primaryColor}"/>
      
      <!-- Event Name -->
      <text x="${dimension * 0.09}" y="${dimension * 0.07}" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="${dimension * 0.038}" fill="#FFFFFF" letter-spacing="1">HH GOA 2026</text>
      <text x="${dimension * 0.8}" y="${dimension * 0.07}" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="${dimension * 0.022}" fill="${theme.accentColor}" text-anchor="end">FEB 2026</text>

      <!-- Divider line -->
      <line x1="${dimension * 0.06}" y1="${dimension * 0.095}" x2="${dimension * 0.78}" y2="${dimension * 0.095}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>

      <!-- User Name & Title -->
      <text x="${dimension * 0.06}" y="${dimension * 0.145}" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="${dimension * 0.034}" fill="#FFFFFF">${nameText}</text>
      <text x="${dimension * 0.06}" y="${dimension * 0.18}" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="${dimension * 0.025}" fill="${theme.accentColor}">${titleText} • #FrameInGoa</text>
    </g>
  </svg>
  `;

  // Base canvas setup
  const canvas = sharp({
    create: {
      width: dimension,
      height: dimension,
      channels: 4,
      background: transparentBg ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 10, g: 15, b: 29, alpha: 1 },
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
 * Builder ID Card Composite Renderer (Apple Pass / Conference Pass Style)
 */
async function generateBuilderCardSharp({
  userSharp,
  builderInfo,
  theme,
  dimension,
  qrBuffer,
}: {
  userSharp: Sharp;
  builderInfo: BuilderInfo;
  theme: typeof FRAME_THEMES['goa-sunset'];
  dimension: number;
  qrBuffer: Buffer;
}): Promise<Buffer> {
  const cardWidth = Math.round(dimension * 0.84);
  const cardHeight = Math.round(dimension * 0.90);
  const cardLeft = Math.round((dimension - cardWidth) / 2);
  const cardTop = Math.round((dimension - cardHeight) / 2);

  // Photo inside Card dimensions
  const photoSize = Math.round(cardWidth * 0.42);
  const photoLeft = Math.round(cardLeft + cardWidth * 0.07);
  const photoTop = Math.round(cardTop + cardHeight * 0.22);

  // Crop photo to square with rounded corners
  const photoScaled = await userSharp
    .resize(photoSize, photoSize, {
      fit: 'cover',
      position: 'attention',
    })
    .toBuffer();

  const photoCornerRadius = Math.round(photoSize * 0.12);
  const photoMaskSvg = Buffer.from(`
    <svg width="${photoSize}" height="${photoSize}">
      <rect x="0" y="0" width="${photoSize}" height="${photoSize}" rx="${photoCornerRadius}" ry="${photoCornerRadius}" fill="#fff"/>
    </svg>
  `);

  const roundedPhoto = await sharp(photoScaled)
    .composite([{ input: photoMaskSvg, blend: 'dest-in' }])
    .toBuffer();

  const nameText = escapeXml(builderInfo.name || 'Alex Rivera');
  const roleText = escapeXml(builderInfo.role || 'Full Stack Engineer');
  const titleText = escapeXml(builderInfo.builderTitle || 'The AI Architect');
  const companyText = escapeXml(builderInfo.company || builderInfo.college || 'HH Goa Attendee');
  const locationText = escapeXml(builderInfo.location || 'Goa, India');
  const hashtagText = escapeXml(builderInfo.customHashtag || '#FrameInGoa');

  const cardSvgOverlay = `
  <svg width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#111827" />
        <stop offset="50%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#030712" />
      </linearGradient>

      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${theme.primaryColor}" />
        <stop offset="100%" stop-color="${theme.accentColor}" />
      </linearGradient>

      <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#ffffff" fill-opacity="0.04" />
      </pattern>
    </defs>

    <!-- Background Canvas -->
    <rect width="${dimension}" height="${dimension}" fill="#050811" />
    <rect width="${dimension}" height="${dimension}" fill="url(#dotPattern)" />

    <!-- Main Card Body -->
    <g transform="translate(${cardLeft}, ${cardTop})">
      <!-- Card Outer Shadow / Border Glow -->
      <rect width="${cardWidth}" height="${cardHeight}" rx="${dimension * 0.035}" fill="url(#cardBgGrad)" stroke="url(#accentGrad)" stroke-width="${dimension * 0.004}" />

      <!-- Top Header Bar -->
      <path d="M 0 ${dimension * 0.035} Q 0 0 ${dimension * 0.035} 0 L ${cardWidth - dimension * 0.035} 0 Q ${cardWidth} 0 ${cardWidth} ${dimension * 0.035} L ${cardWidth} ${dimension * 0.12} L 0 ${dimension * 0.12} Z" fill="url(#accentGrad)" opacity="0.15" />
      
      <!-- Top Header Branding -->
      <text x="${cardWidth * 0.07}" y="${cardHeight * 0.08}" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="${dimension * 0.034}" fill="#FFFFFF" letter-spacing="2">HH GOA 2026</text>
      
      <g transform="translate(${cardWidth * 0.7}, ${cardHeight * 0.045})">
        <rect width="${cardWidth * 0.23}" height="${cardHeight * 0.045}" rx="${cardHeight * 0.022}" fill="url(#accentGrad)" />
        <text x="${cardWidth * 0.115}" y="${cardHeight * 0.03}" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="${dimension * 0.016}" fill="#FFFFFF" text-anchor="middle">BUILDER PASS</text>
      </g>

      <!-- Photo Border Ring -->
      <rect x="${cardWidth * 0.07 - dimension * 0.005}" y="${cardHeight * 0.22 - dimension * 0.005}" width="${photoSize + dimension * 0.01}" height="${photoSize + dimension * 0.01}" rx="${photoCornerRadius + dimension * 0.005}" fill="none" stroke="url(#accentGrad)" stroke-width="${dimension * 0.004}" />

      <!-- Right Column Info (Name, Title, Stack, Org) -->
      <g transform="translate(${cardWidth * 0.53}, ${cardHeight * 0.23})">
        <!-- Builder Title Badge -->
        <rect x="0" y="0" width="${cardWidth * 0.4}" height="${cardHeight * 0.045}" rx="${cardHeight * 0.012}" fill="${theme.primaryColor}" opacity="0.2" stroke="${theme.primaryColor}" stroke-width="1.5" />
        <text x="${cardWidth * 0.02}" y="${cardHeight * 0.03}" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="${dimension * 0.018}" fill="${theme.accentColor}">${titleText}</text>

        <!-- Name -->
        <text x="0" y="${cardHeight * 0.11}" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="${dimension * 0.036}" fill="#FFFFFF">${nameText}</text>
        
        <!-- Role / Stack -->
        <text x="0" y="${cardHeight * 0.16}" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="${dimension * 0.024}" fill="${theme.accentColor}">${roleText}</text>

        <!-- Organization / College -->
        <text x="0" y="${cardHeight * 0.21}" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="${dimension * 0.020}" fill="#94A3B8">${companyText}</text>

        <!-- Location -->
        <text x="0" y="${cardHeight * 0.25}" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="${dimension * 0.018}" fill="#64748B">📍 ${locationText}</text>
      </g>

      <!-- Horizontal Divider -->
      <line x1="${cardWidth * 0.07}" y1="${cardHeight * 0.72}" x2="${cardWidth * 0.93}" y2="${cardHeight * 0.72}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" stroke-dasharray="6 6" />

      <!-- Footer Section: Event Info & Hashtag -->
      <g transform="translate(${cardWidth * 0.07}, ${cardHeight * 0.78})">
        <text x="0" y="0" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="${dimension * 0.026}" fill="#FFFFFF" letter-spacing="1">FEBRUARY 2026 • GOA, INDIA</text>
        <text x="0" y="${cardHeight * 0.05}" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="${dimension * 0.022}" fill="${theme.primaryColor}">${hashtagText}</text>
        <text x="0" y="${cardHeight * 0.09}" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="${dimension * 0.016}" fill="#64748B">Scan QR to verify official builder pass</text>
      </g>
    </g>
  </svg>
  `;

  const canvas = sharp({
    create: {
      width: dimension,
      height: dimension,
      channels: 4,
      background: { r: 5, g: 8, b: 17, alpha: 1 },
    },
  });

  const qrSize = Math.round(cardWidth * 0.16);
  const qrTop = Math.round(cardTop + cardHeight * 0.75);
  const qrLeft = Math.round(cardLeft + cardWidth * 0.75);

  const qrResized = await sharp(qrBuffer)
    .resize(qrSize, qrSize)
    .toBuffer();

  return canvas
    .composite([
      {
        input: roundedPhoto,
        top: photoTop,
        left: photoLeft,
      },
      {
        input: Buffer.from(cardSvgOverlay),
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
