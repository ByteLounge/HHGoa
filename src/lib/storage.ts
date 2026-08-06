import { GeneratedGraphicRecord } from '@/types';
import fs from 'fs';
import path from 'path';
import { supabase, BUCKET_NAME } from './supabase';

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

  const base64Data = record.imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const pngBuffer = Buffer.from(base64Data, 'base64');

  // 2. Persist to disk files (data/graphics/{id}.json and data/graphics/{id}.png)
  try {
    const dir = getGraphicsDir();
    const jsonPath = path.join(dir, `${record.id}.json`);
    const pngPath = path.join(dir, `${record.id}.png`);

    const metadata = {
      id: record.id,
      type: record.type,
      builderInfo: record.builderInfo,
      themeId: record.themeId,
      createdAt: record.createdAt,
      shareUrl: record.shareUrl,
    };

    await fs.promises.writeFile(jsonPath, JSON.stringify(metadata, null, 2), 'utf-8');
    await fs.promises.writeFile(pngPath, pngBuffer);
  } catch (err) {
    console.warn('Failed to save graphic record to disk:', err);
  }

  // 3. Upload to Supabase Storage if configured
  if (supabase) {
    try {
      const filePath = `${record.type}s/${record.id}.png`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, pngBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase Storage upload message:', uploadError.message);
      } else {
        console.log(`Successfully stored graphic ${record.id} in Supabase Storage (${filePath})`);
      }

      // Optional metadata insertion into Supabase DB table 'graphics'
      try {
        await supabase.from('graphics').upsert({
          id: record.id,
          type: record.type,
          builder_info: record.builderInfo,
          theme_id: record.themeId,
          created_at: record.createdAt,
          share_url: record.shareUrl,
          image_path: filePath,
        });
      } catch (err: unknown) {
        console.warn('Supabase DB table save skipped:', err);
      }
    } catch (err) {
      console.warn('Supabase Storage integration skipped:', err);
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

  // Try fetching from Supabase Storage
  if (supabase) {
    try {
      for (const folder of ['cards', 'frames']) {
        const filePath = `${folder}/${id}.png`;
        const { data, error } = await supabase.storage.from(BUCKET_NAME).download(filePath);
        if (data && !error) {
          const arrayBuffer = await data.arrayBuffer();
          const pngBuffer = Buffer.from(arrayBuffer);
          const imageDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

          const record: GeneratedGraphicRecord = {
            id,
            type: folder === 'cards' ? 'card' : 'frame',
            imageDataUrl,
            builderInfo: {
              name: 'Hacker House Builder',
              role: 'Builder',
              builderTitle: 'Hacker House Goa',
              company: 'Hacker House',
              location: 'Goa, India',
              customHashtag: '#FrameInGoa',
            },
            themeId: 'hhgoa-editorial',
            createdAt: new Date().toISOString(),
            shareUrl: `https://hhgoa2026.vercel.app/${folder === 'cards' ? 'card' : 'frame'}/${id}`,
          };

          graphicMemoryStore.set(id, record);
          return record;
        }
      }
    } catch (err) {
      console.warn(`Error downloading graphic ${id} from Supabase:`, err);
    }
  }

  return null;
}
