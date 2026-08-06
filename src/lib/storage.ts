import { GeneratedGraphicRecord } from '@/types';
import fs from 'fs';
import path from 'path';

// Server-side in-memory cache + persistent disk store
const graphicStore = new Map<string, GeneratedGraphicRecord>();

const getStorageFilePath = (): string => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      return path.join(process.cwd(), 'records.json');
    }
  }
  return path.join(dataDir, 'records.json');
};

const loadRecordsFromDisk = (): void => {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const records: GeneratedGraphicRecord[] = JSON.parse(raw);
      for (const rec of records) {
        if (rec && rec.id) {
          graphicStore.set(rec.id, rec);
        }
      }
    }
  } catch (err) {
    console.warn('Could not read records from disk:', err);
  }
};

// Load existing records on startup
loadRecordsFromDisk();

export async function saveGraphicRecord(record: GeneratedGraphicRecord): Promise<void> {
  graphicStore.set(record.id, record);

  try {
    const filePath = getStorageFilePath();
    let records: GeneratedGraphicRecord[] = [];
    if (fs.existsSync(filePath)) {
      try {
        records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch {
        records = [];
      }
    }
    // Update or prepend record
    records = [record, ...records.filter((r) => r.id !== record.id)].slice(0, 200);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not save record to disk:', err);
  }

  // If Vercel Blob is configured:
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
      console.warn('Vercel Blob upload skipped or failed:', err);
    }
  }
}

export async function getGraphicRecord(id: string): Promise<GeneratedGraphicRecord | null> {
  if (graphicStore.has(id)) {
    return graphicStore.get(id)!;
  }
  // Try reloading from disk if not found in memory map
  loadRecordsFromDisk();
  if (graphicStore.has(id)) {
    return graphicStore.get(id)!;
  }
  return null;
}
