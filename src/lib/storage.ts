import { GeneratedGraphicRecord } from '@/types';
import fs from 'fs';
import path from 'path';

// Memory cache for super-fast lookups
const graphicMemoryStore = new Map<string, GeneratedGraphicRecord>();

const getGraphicsDir = (): string => {
  const dir = path.join(process.cwd(), 'data', 'graphics');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
      console.warn('Could not create graphics directory:', err);
    }
  }
  return dir;
};

export async function saveGraphicRecord(record: GeneratedGraphicRecord): Promise<void> {
  // 1. Cache in memory
  graphicMemoryStore.set(record.id, record);

  // 2. Persist to disk files (data/graphics/{id}.json and data/graphics/{id}.png)
  try {
    const dir = getGraphicsDir();
    const jsonPath = path.join(dir, `${record.id}.json`);
    const pngPath = path.join(dir, `${record.id}.png`);

    // Separate base64 image data from metadata to keep JSON small
    const base64Data = record.imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const pngBuffer = Buffer.from(base64Data, 'base64');

    const metadata = {
      id: record.id,
      type: record.type,
      builderInfo: record.builderInfo,
      themeId: record.themeId,
      createdAt: record.createdAt,
      shareUrl: record.shareUrl,
    };

    // Write PNG and JSON files asynchronously
    await fs.promises.writeFile(jsonPath, JSON.stringify(metadata, null, 2), 'utf-8');
    await fs.promises.writeFile(pngPath, pngBuffer);
  } catch (err) {
    console.warn('Failed to save graphic record to disk:', err);
  }

  // 3. Optional Vercel Blob backup if token exists
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob');
      const base64Data = record.imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      await put(`hhgoa-2026/${record.id}.png`, buffer, {
        access: 'public',
        contentType: 'image/png',
      });
    } catch (err) {
      console.warn('Vercel Blob upload skipped:', err);
    }
  }
}

export async function getGraphicRecord(id: string): Promise<GeneratedGraphicRecord | null> {
  // Check memory store first
  if (graphicMemoryStore.has(id)) {
    return graphicMemoryStore.get(id)!;
  }

  // Try reading from disk
  try {
    const dir = getGraphicsDir();
    const jsonPath = path.join(dir, `${id}.json`);
    const pngPath = path.join(dir, `${id}.png`);

    if (fs.existsSync(jsonPath) && fs.existsSync(pngPath)) {
      const jsonRaw = await fs.promises.readFile(jsonPath, 'utf-8');
      const metadata = JSON.parse(jsonRaw);
      const pngBuffer = await fs.promises.readFile(pngPath);
      const imageDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

      const record: GeneratedGraphicRecord = {
        ...metadata,
        imageDataUrl,
      };

      graphicMemoryStore.set(id, record);
      return record;
    }
  } catch (err) {
    console.warn(`Error reading graphic record ${id} from disk:`, err);
  }

  return null;
}
