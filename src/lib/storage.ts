import { GeneratedGraphicRecord, ThemeId } from '@/types';
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

// Helper to ensure Supabase Storage bucket exists
async function ensureBucketExists(): Promise<void> {
  if (!supabase) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'application/json'],
      });
    }
  } catch {
    // Ignore error if client lacks bucket admin permissions or bucket already exists
  }
}

/**
 * Helper to remove previous graphics with matching builder details (name, role, company, type)
 * so only the latest pass/frame is kept in Supabase Storage, Supabase DB, memory, and disk.
 */
async function cleanupDuplicateGraphics(newRecord: GeneratedGraphicRecord): Promise<void> {
  const newName = (newRecord.builderInfo.name || '').trim().toLowerCase();
  const newRole = (newRecord.builderInfo.role || '').trim().toLowerCase();
  const newCompany = (newRecord.builderInfo.company || newRecord.builderInfo.college || '').trim().toLowerCase();
  const newType = newRecord.type;

  if (!newName) return;

  // 1. Clean memory store
  for (const [key, existing] of graphicMemoryStore.entries()) {
    if (key !== newRecord.id && existing.type === newType) {
      const exName = (existing.builderInfo.name || '').trim().toLowerCase();
      const exRole = (existing.builderInfo.role || '').trim().toLowerCase();
      const exCompany = (existing.builderInfo.company || existing.builderInfo.college || '').trim().toLowerCase();

      if (exName === newName && exRole === newRole && exCompany === newCompany) {
        graphicMemoryStore.delete(key);
      }
    }
  }

  // 2. Clean local disk
  try {
    const dir = getGraphicsDir();
    if (fs.existsSync(dir)) {
      const files = await fs.promises.readdir(dir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const oldId = file.replace('.json', '');
          if (oldId === newRecord.id) continue;
          try {
            const content = await fs.promises.readFile(path.join(dir, file), 'utf-8');
            const meta = JSON.parse(content);
            const metaType = meta.type || 'card';
            const metaName = (meta.builderInfo?.name || '').trim().toLowerCase();
            const metaRole = (meta.builderInfo?.role || '').trim().toLowerCase();
            const metaCompany = (meta.builderInfo?.company || meta.builderInfo?.college || '').trim().toLowerCase();

            if (metaType === newType && metaName === newName && metaRole === newRole && metaCompany === newCompany) {
              await fs.promises.unlink(path.join(dir, `${oldId}.json`)).catch(() => {});
              await fs.promises.unlink(path.join(dir, `${oldId}.png`)).catch(() => {});
            }
          } catch {
            // Ignore single file parse error
          }
        }
      }
    }
  } catch (err) {
    console.warn('Disk cleanup warning:', err);
  }

  // 3. Clean Supabase Storage & Supabase DB
  if (supabase) {
    try {
      const folder = newType === 'frame' ? 'frames' : 'cards';
      const { data: fileList } = await supabase.storage.from(BUCKET_NAME).list(folder);

      if (fileList && fileList.length > 0) {
        const jsonFiles = fileList.filter((f) => f.name.endsWith('.json'));
        for (const jFile of jsonFiles) {
          const oldId = jFile.name.replace('.json', '');
          if (oldId === newRecord.id) continue;

          try {
            const { data: jsonData } = await supabase.storage
              .from(BUCKET_NAME)
              .download(`${folder}/${jFile.name}`);

            if (jsonData) {
              const text = await jsonData.text();
              const meta = JSON.parse(text);
              const metaName = (meta.builderInfo?.name || '').trim().toLowerCase();
              const metaRole = (meta.builderInfo?.role || '').trim().toLowerCase();
              const metaCompany = (meta.builderInfo?.company || meta.builderInfo?.college || '').trim().toLowerCase();

              if (metaName === newName && metaRole === newRole && metaCompany === newCompany) {
                // Delete previous PNG and JSON from Supabase Storage
                await supabase.storage
                  .from(BUCKET_NAME)
                  .remove([`${folder}/${oldId}.png`, `${folder}/${oldId}.json`]);

                console.log(`Discarded previous duplicate graphic ${oldId} for builder "${newRecord.builderInfo.name}" in Supabase Storage`);
              }
            }
          } catch {
            // Ignore single file check error
          }
        }
      }

      // Delete from Supabase DB table if configured
      try {
        await supabase
          .from('graphics')
          .delete()
          .eq('type', newType);
      } catch {
        // Table cleanup optional
      }
    } catch (err) {
      console.warn('Supabase duplicate cleanup warning:', err);
    }
  }
}

export async function saveGraphicRecord(record: GeneratedGraphicRecord): Promise<void> {
  // Discard older duplicate passes with matching details before saving new record
  await cleanupDuplicateGraphics(record);

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
      await ensureBucketExists();

      const folder = record.type === 'frame' ? 'frames' : 'cards';
      const pngFilePath = `${folder}/${record.id}.png`;
      const jsonFilePath = `${folder}/${record.id}.json`;

      // Upload PNG Image
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(pngFilePath, pngBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase Storage PNG upload message:', uploadError.message);
      } else {
        console.log(`Successfully stored graphic ${record.id} in Supabase Storage (${pngFilePath})`);
      }

      // Upload JSON Metadata
      const metadataBuffer = Buffer.from(
        JSON.stringify(
          {
            id: record.id,
            type: record.type,
            builderInfo: record.builderInfo,
            themeId: record.themeId,
            createdAt: record.createdAt,
            shareUrl: record.shareUrl,
          },
          null,
          2
        ),
        'utf-8'
      );

      const { error: jsonUploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(jsonFilePath, metadataBuffer, {
          contentType: 'application/json',
          upsert: true,
        });

      if (jsonUploadError) {
        console.warn('Supabase Storage JSON upload message:', jsonUploadError.message);
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
          image_path: pngFilePath,
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
        const pngFilePath = `${folder}/${id}.png`;
        const jsonFilePath = `${folder}/${id}.json`;

        // Check if DB table record exists first for full metadata accuracy
        try {
          const { data: dbData, error: dbError } = await supabase
            .from('graphics')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (dbData && !dbError) {
            const { data: pngData, error: pngError } = await supabase.storage
              .from(BUCKET_NAME)
              .download(pngFilePath);

            if (pngData && !pngError) {
              const arrayBuffer = await pngData.arrayBuffer();
              const pngBuffer = Buffer.from(arrayBuffer);
              const imageDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

              const record: GeneratedGraphicRecord = {
                id: dbData.id,
                type: dbData.type,
                imageDataUrl,
                builderInfo: dbData.builder_info,
                themeId: (dbData.theme_id || 'hhgoa-editorial') as ThemeId,
                createdAt: dbData.created_at,
                shareUrl: dbData.share_url,
              };

              graphicMemoryStore.set(id, record);
              return record;
            }
          }
        } catch {
          // DB query error, proceed to storage check
        }

        // Check Storage PNG file
        const { data: pngData, error: pngError } = await supabase.storage
          .from(BUCKET_NAME)
          .download(pngFilePath);

        if (pngData && !pngError) {
          const arrayBuffer = await pngData.arrayBuffer();
          const pngBuffer = Buffer.from(arrayBuffer);
          const imageDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;

          let builderInfo = {
            name: 'Hacker House Builder',
            role: 'Builder',
            builderTitle: 'Hacker House Goa',
            company: 'Hacker House',
            location: 'Goa, India',
            customHashtag: '#FrameInGoa',
          };
          let themeId: ThemeId = 'hhgoa-editorial';
          let createdAt = new Date().toISOString();
          let shareUrl = `/${folder === 'cards' ? 'card' : 'frame'}/${id}`;

          // Try downloading JSON metadata from Storage
          try {
            const { data: jsonData, error: jsonError } = await supabase.storage
              .from(BUCKET_NAME)
              .download(jsonFilePath);

            if (jsonData && !jsonError) {
              const jsonText = await jsonData.text();
              const metadata = JSON.parse(jsonText);
              if (metadata.builderInfo) builderInfo = metadata.builderInfo;
              if (metadata.themeId) themeId = metadata.themeId as ThemeId;
              if (metadata.createdAt) createdAt = metadata.createdAt;
              if (metadata.shareUrl) shareUrl = metadata.shareUrl;
            }
          } catch {
            // Ignore JSON read error, use fallback info
          }

          const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(pngFilePath).data.publicUrl;

          const record: GeneratedGraphicRecord = {
            id,
            type: folder === 'cards' ? 'card' : 'frame',
            imageDataUrl,
            builderInfo,
            themeId,
            createdAt,
            shareUrl,
            publicUrl,
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
