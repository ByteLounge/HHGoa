import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No HEIC file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let pngBuffer: Buffer;

    try {
      // Try Sharp first (libvips supports HEIC natively when compiled with libheif)
      pngBuffer = await sharp(inputBuffer).toFormat('png').toBuffer();
    } catch (sharpErr) {
      console.warn('Sharp native HEIC failed, attempting heic-convert fallback:', sharpErr);
      const convertModule = await import('heic-convert');
      const convert = convertModule.default || convertModule;
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'PNG',
      });
      pngBuffer = Buffer.from(outputBuffer);
    }

    const base64Png = `data:image/png;base64,${pngBuffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      convertedDataUrl: base64Png,
    });
  } catch (error: unknown) {
    console.error('HEIC conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to process HEIC file. Please try uploading a JPG or PNG.' },
      { status: 500 }
    );
  }
}
