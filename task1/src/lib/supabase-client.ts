import { createClient } from '@supabase/supabase-js';
import { GeneratedGraphicRecord } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseClient =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'hhgoa-graphics';

/**
 * Uploads generated graphic PNG and JSON directly to Supabase Storage from browser client
 */
export async function uploadGraphicFromClient(record: GeneratedGraphicRecord): Promise<void> {
  if (!supabaseClient) return;

  try {
    const folder = record.type === 'frame' ? 'frames' : 'cards';
    const pngFilePath = `${folder}/${record.id}.png`;
    const jsonFilePath = `${folder}/${record.id}.json`;

    // Convert Base64 data URL to Blob
    const res = await fetch(record.imageDataUrl);
    const blob = await res.blob();

    // 1. Upload PNG to Supabase Storage
    const { error: pngErr } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(pngFilePath, blob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (pngErr) {
      console.warn('Client Supabase PNG upload notice:', pngErr.message);
    } else {
      console.log(`Client successfully uploaded ${record.id} to Supabase Storage (${pngFilePath})`);
    }

    // 2. Upload JSON Metadata to Supabase Storage
    const metadataBlob = new Blob(
      [
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
      ],
      { type: 'application/json' }
    );

    const { error: jsonErr } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(jsonFilePath, metadataBlob, {
        contentType: 'application/json',
        upsert: true,
      });

    if (jsonErr) {
      console.warn('Client Supabase JSON upload notice:', jsonErr.message);
    }

    // 3. Upsert record metadata to Supabase DB 'graphics' table
    try {
      await supabaseClient.from('graphics').upsert({
        id: record.id,
        type: record.type,
        builder_info: record.builderInfo,
        theme_id: record.themeId,
        created_at: record.createdAt,
        share_url: record.shareUrl,
        image_path: pngFilePath,
        image_data_url: record.imageDataUrl,
      });
    } catch {
      // Table insert optional
    }
  } catch (err) {
    console.warn('Client Supabase upload warning:', err);
  }
}
