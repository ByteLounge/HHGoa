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
    const name = searchParams.get('name') || 'Hacker House Builder';
    const role = searchParams.get('role') || 'Builder';
    const title = searchParams.get('title') || 'Official Credential';
    const company = searchParams.get('company') || 'Hacker House';
    const location = searchParams.get('location') || 'Goa, India';
    const customHashtag = searchParams.get('tag') || '#FrameInGoa';
    const themeId = (searchParams.get('theme') as ThemeId) || 'hhgoa-editorial';

    const photoParam = searchParams.get('photo');
    const imgParam = searchParams.get('img');
    let userPhotoBuffer: Buffer | null = null;

    if (photoParam) {
      try {
        const cleanBase64 = photoParam.replace(/^data:image\/\w+;base64,/, '');
        userPhotoBuffer = Buffer.from(cleanBase64, 'base64');
      } catch {
        // Base64 decode fallback
      }
    }

    if (!userPhotoBuffer && imgParam && (imgParam.startsWith('http://') || imgParam.startsWith('https://'))) {
      try {
        const fetchRes = await fetch(imgParam);
        if (fetchRes.ok) {
          const ab = await fetchRes.arrayBuffer();
          userPhotoBuffer = Buffer.from(ab);
        }
      } catch {
        // Fallback to default photo if image fetch fails
      }
    }

    if (!userPhotoBuffer) {
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'HH';

      const avatarSvg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#0E6B3A"/><circle cx="200" cy="200" r="150" fill="#0A4C2B" stroke="#FFD400" stroke-width="8"/><text x="200" y="240" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="130" fill="#FFD400" text-anchor="middle">${initials}</text></svg>`;

      userPhotoBuffer = await sharp(Buffer.from(avatarSvg))
        .png()
        .toBuffer();
    }

    pngBuffer = await generateHighResGraphic({
      userImageBuffer: userPhotoBuffer,
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
      'Content-Length': pngBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}

export async function HEAD(req: NextRequest) {
  const res = await GET(req);
  return new NextResponse(null, {
    status: res.status,
    headers: res.headers,
  });
}
