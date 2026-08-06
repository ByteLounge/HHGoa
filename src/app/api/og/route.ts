import { NextRequest, NextResponse } from 'next/server';
import { getGraphicRecord } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  const record = await getGraphicRecord(id);
  if (!record || !record.imageDataUrl) {
    // Fallback default image response if record not found
    return new NextResponse('Graphic not found', { status: 404 });
  }

  const base64Data = record.imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');

  return new NextResponse(new Uint8Array(imageBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
