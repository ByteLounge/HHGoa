import { NextRequest, NextResponse } from 'next/server';
import { getGraphicRecord } from '@/lib/storage';
import { generateHighResGraphic } from '@/lib/image-processor';
import sharp from 'sharp';
import { ThemeId } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const record = await getGraphicRecord(id);

  let pngBuffer: Buffer;

  if (record && record.imageDataUrl) {
    const base64Data = record.imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    pngBuffer = Buffer.from(base64Data, 'base64');
  } else {
    // Dynamic fallback image generation if record is not found in memory/disk
    const graphicType = searchParams.get('type') === 'frame' ? 'frame' : 'card';
    const name = searchParams.get('name') || 'Official Builder';
    const role = searchParams.get('role') || 'Full Stack Engineer';
    const title = searchParams.get('title') || 'The AI Architect';
    const company = searchParams.get('company') || '2:47 PM Studio';
    const location = searchParams.get('location') || 'Goa, India';
    const customHashtag = searchParams.get('tag') || '#FrameInGoa';
    const themeId = (searchParams.get('theme') as ThemeId) || 'hhgoa-editorial';

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'HH';

    const avatarSvg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#0E6B3A"/><circle cx="200" cy="200" r="150" fill="#FFD400" stroke="#0A4C2B" stroke-width="8"/><text x="200" y="240" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="130" fill="#0A4C2B" text-anchor="middle">${initials}</text></svg>`;

    const defaultPhoto = await sharp(Buffer.from(avatarSvg))
      .png()
      .toBuffer();

    pngBuffer = await generateHighResGraphic({
      userImageBuffer: defaultPhoto,
      builderInfo: {
        name,
        role,
        builderTitle: title,
        company,
        location,
        customHashtag,
      },
      cropConfig: { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
      exportOptions: {
        resolution: '1080x1080',
        transparentBg: false,
        themeId,
        graphicType,
      },
      shareUrl: `${req.nextUrl.origin}/${graphicType}/${id}`,
    });
  }

  return new NextResponse(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
