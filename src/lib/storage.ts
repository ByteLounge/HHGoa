import { GeneratedGraphicRecord } from '@/types';

// Server-side in-memory cache for demo & immediate retrieval
const graphicStore = new Map<string, GeneratedGraphicRecord>();

export async function saveGraphicRecord(record: GeneratedGraphicRecord): Promise<void> {
  graphicStore.set(record.id, record);

  // If Vercel Blob is configured:
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob');
      // Convert base64 dataUrl back to buffer if needed
      const base64Data = record.imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      await put(`hhgoa-2026/${record.id}.png`, buffer, {
        access: 'public',
        contentType: 'image/png',
      });
    } catch (err) {
      console.warn('Vercel Blob upload skipped or failed:', err);
    }
  }
}

export async function getGraphicRecord(id: string): Promise<GeneratedGraphicRecord | null> {
  if (graphicStore.has(id)) {
    return graphicStore.get(id)!;
  }
  return null;
}
