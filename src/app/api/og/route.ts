import { NextRequest, NextResponse } from 'next/server';
import { getGraphicRecord } from '@/lib/storage';
import { generateHighResGraphic } from '@/lib/image-processor';
import sharp from 'sharp';

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

    const defaultPhoto = await sharp({
      create: {
        width: 400,
        height: 400,
        channels: 4,
        background: { r: 14, g: 107, b: 58, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    pngBuffer = await generateHighResGraphic({
      userImageBuffer: defaultPhoto,
      builderInfo: {
        name,
        role,
        builderTitle: title,
        company: '2:47 PM Studio',
        location: 'Goa, India',
        customHashtag: '#FrameInGoa',
      },
      cropConfig: { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
      exportOptions: {
        resolution: '1080x1080',
        transparentBg: false,
        themeId: 'hhgoa-editorial',
        graphicType: graphicType,
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
