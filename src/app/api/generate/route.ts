import { NextRequest, NextResponse } from 'next/server';
import { generateHighResGraphic } from '@/lib/image-processor';
import { builderInfoSchema } from '@/lib/validation';
import { saveGraphicRecord } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const builderInfoJson = formData.get('builderInfo') as string;
    const exportOptionsJson = formData.get('exportOptions') as string;
    const cropConfigJson = formData.get('cropConfig') as string;

    if (!file) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    const builderInfoRaw = builderInfoJson ? JSON.parse(builderInfoJson) : {};
    const exportOptions = exportOptionsJson
      ? JSON.parse(exportOptionsJson)
      : { resolution: '1080x1080', transparentBg: false, themeId: 'goa-sunset', graphicType: 'card' };
    const cropConfig = cropConfigJson ? JSON.parse(cropConfigJson) : { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 };

    // Validate builder info
    const parsedBuilderInfo = builderInfoSchema.parse(builderInfoRaw);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const graphicId = uuidv4();
    const origin = req.nextUrl.origin || 'https://hhgoa2026.vercel.app';
    const shareUrl = `${origin}/${exportOptions.graphicType}/${graphicId}`;

    const pngBuffer = await generateHighResGraphic({
      userImageBuffer: buffer,
      builderInfo: parsedBuilderInfo,
      cropConfig,
      exportOptions,
      shareUrl,
    });

    const base64DataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

    // Store graphic record for sharing page
    await saveGraphicRecord({
      id: graphicId,
      type: exportOptions.graphicType,
      imageDataUrl: base64DataUrl,
      builderInfo: parsedBuilderInfo,
      themeId: exportOptions.themeId,
      createdAt: new Date().toISOString(),
      shareUrl,
    });

    // Check if client requested direct binary stream vs JSON with dataUrl & record metadata
    const acceptHeader = req.headers.get('accept') || '';
    if (acceptHeader.includes('image/png')) {
      return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="HHGoa2026_${exportOptions.graphicType}_${graphicId.slice(0, 8)}.png"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return NextResponse.json({
      success: true,
      id: graphicId,
      shareUrl,
      imageDataUrl: base64DataUrl,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to generate graphic. Please try again.';
    console.error('Error generating graphic:', error);
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
