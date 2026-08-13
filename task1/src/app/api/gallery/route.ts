import { NextResponse } from 'next/server';
import { supabase, BUCKET_NAME } from '@/lib/supabase';
import { getAllGraphicRecords } from '@/lib/storage';

export interface GalleryItem {
  id: string;
  type: 'card' | 'frame';
  imageUrl: string;
  shareUrl: string;
  createdAt: string;
  builderName?: string;
  builderTitle?: string;
  builderRole?: string;
  builderCompany?: string;
}

/**
 * Checks if a graphic ID or builder name belongs to test/dummy fixture data
 */
function isDummyOrTestItem(id: string, builderName?: string): boolean {
  if (!id) return true;
  const lowerId = id.toLowerCase();

  if (
    lowerId.startsWith('test-') ||
    lowerId.startsWith('dup-') ||
    lowerId.startsWith('dummy-') ||
    lowerId.startsWith('mock-') ||
    lowerId.startsWith('non-existent')
  ) {
    return true;
  }

  if (builderName) {
    const lowerName = builderName.toLowerCase();
    if (
      lowerName.includes('abcdef') ||
      lowerName.includes('john doe abc') ||
      lowerName.includes('test user')
    ) {
      return true;
    }
  }

  return false;
}

export async function GET() {
  const itemsMap = new Map<string, GalleryItem>();

  if (supabase) {
    // 1. First, query Supabase DB 'graphics' table if available
    try {
      const { data: dbRows, error: dbError } = await supabase
        .from('graphics')
        .select('*')
        .order('created_at', { ascending: false });

      if (!dbError && dbRows && dbRows.length > 0) {
        for (const row of dbRows) {
          if (isDummyOrTestItem(row.id, row.builder_info?.name)) continue;

          const folder = row.type === 'frame' ? 'frames' : 'cards';
          const imagePath = row.image_path || `${folder}/${row.id}.png`;
          const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(imagePath).data.publicUrl;

          itemsMap.set(row.id, {
            id: row.id,
            type: row.type || 'card',
            imageUrl: publicUrl,
            shareUrl: row.share_url || `/${row.type || 'card'}/${row.id}`,
            createdAt: row.created_at || new Date().toISOString(),
            builderName: row.builder_info?.name,
            builderTitle: row.builder_info?.builderTitle,
            builderRole: row.builder_info?.role,
            builderCompany: row.builder_info?.company || row.builder_info?.college,
          });
        }
      }
    } catch (err) {
      console.warn('Supabase DB gallery fetch notice:', err);
    }

    // 2. Fetch directly from Supabase Storage files
    try {
      // Cards folder
      const { data: cardFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('cards', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });

      if (cardFiles && cardFiles.length > 0) {
        for (const file of cardFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');
            if (isDummyOrTestItem(id)) continue;

            const publicUrl = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`cards/${file.name}`).data.publicUrl;

            let builderName: string | undefined;
            let builderTitle: string | undefined;
            let builderRole: string | undefined;
            let builderCompany: string | undefined;

            try {
              const { data: jsonData } = await supabase.storage
                .from(BUCKET_NAME)
                .download(`cards/${id}.json`);

              if (jsonData) {
                const text = await jsonData.text();
                const meta = JSON.parse(text);
                builderName = meta.builderInfo?.name;
                builderTitle = meta.builderInfo?.builderTitle;
                builderRole = meta.builderInfo?.role;
                builderCompany = meta.builderInfo?.company || meta.builderInfo?.college;
              }
            } catch {
              // Ignore single file metadata download fail
            }

            if (isDummyOrTestItem(id, builderName)) continue;

            const existing = itemsMap.get(id);
            itemsMap.set(id, {
              id,
              type: 'card',
              imageUrl: existing?.imageUrl || publicUrl,
              shareUrl: existing?.shareUrl || `/card/${id}`,
              createdAt: file.created_at || existing?.createdAt || new Date().toISOString(),
              builderName: existing?.builderName || builderName,
              builderTitle: existing?.builderTitle || builderTitle,
              builderRole: existing?.builderRole || builderRole,
              builderCompany: existing?.builderCompany || builderCompany,
            });
          }
        }
      }

      // Frames folder
      const { data: frameFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('frames', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });

      if (frameFiles && frameFiles.length > 0) {
        for (const file of frameFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');
            if (isDummyOrTestItem(id)) continue;

            const publicUrl = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`frames/${file.name}`).data.publicUrl;

            let builderName: string | undefined;
            let builderTitle: string | undefined;
            let builderRole: string | undefined;
            let builderCompany: string | undefined;

            try {
              const { data: jsonData } = await supabase.storage
                .from(BUCKET_NAME)
                .download(`frames/${id}.json`);

              if (jsonData) {
                const text = await jsonData.text();
                const meta = JSON.parse(text);
                builderName = meta.builderInfo?.name;
                builderTitle = meta.builderInfo?.builderTitle;
                builderRole = meta.builderInfo?.role;
                builderCompany = meta.builderInfo?.company || meta.builderInfo?.college;
              }
            } catch {
              // Ignore single file metadata download fail
            }

            if (isDummyOrTestItem(id, builderName)) continue;

            const existing = itemsMap.get(id);
            itemsMap.set(id, {
              id,
              type: 'frame',
              imageUrl: existing?.imageUrl || publicUrl,
              shareUrl: existing?.shareUrl || `/frame/${id}`,
              createdAt: file.created_at || existing?.createdAt || new Date().toISOString(),
              builderName: existing?.builderName || builderName,
              builderTitle: existing?.builderTitle || builderTitle,
              builderRole: existing?.builderRole || builderRole,
              builderCompany: existing?.builderCompany || builderCompany,
            });
          }
        }
      }
    } catch (err) {
      console.warn('Gallery Supabase Storage listing warning:', err);
    }
  }

  // 3. Merge server memory & disk records
  try {
    const localRecords = await getAllGraphicRecords();
    for (const rec of localRecords) {
      if (isDummyOrTestItem(rec.id, rec.builderInfo?.name)) continue;

      const existing = itemsMap.get(rec.id);
      itemsMap.set(rec.id, {
        id: rec.id,
        type: rec.type,
        imageUrl: existing?.imageUrl || rec.publicUrl || rec.imageDataUrl || `/api/og?id=${rec.id}&type=${rec.type}`,
        shareUrl: existing?.shareUrl || rec.shareUrl || `/${rec.type}/${rec.id}`,
        createdAt: rec.createdAt || existing?.createdAt || new Date().toISOString(),
        builderName: rec.builderInfo?.name || existing?.builderName,
        builderTitle: rec.builderInfo?.builderTitle || existing?.builderTitle,
        builderRole: rec.builderInfo?.role || existing?.builderRole,
        builderCompany: rec.builderInfo?.company || rec.builderInfo?.college || existing?.builderCompany,
      });
    }
  } catch (err) {
    console.warn('Gallery local records merge warning:', err);
  }

  const allItems = Array.from(itemsMap.values());

  // Sort newest first
  allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Deduplicate items: Keep only the latest entry per unique builder identity + type
  const uniqueMap = new Map<string, GalleryItem>();
  const duplicateIdsToRemove: { id: string; type: 'card' | 'frame' }[] = [];

  for (const item of allItems) {
    const key = item.builderName
      ? `${item.type}_${(item.builderName || '').trim().toLowerCase()}_${(item.builderRole || '').trim().toLowerCase()}_${(item.builderCompany || '').trim().toLowerCase()}`
      : `id_${item.id}`;

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    } else {
      duplicateIdsToRemove.push({ id: item.id, type: item.type });
    }
  }

  // Asynchronously purge older duplicates from Supabase Storage if found
  if (supabase && duplicateIdsToRemove.length > 0) {
    (async () => {
      try {
        for (const dup of duplicateIdsToRemove) {
          const folder = dup.type === 'frame' ? 'frames' : 'cards';
          await supabase!.storage
            .from(BUCKET_NAME)
            .remove([`${folder}/${dup.id}.png`, `${folder}/${dup.id}.json`]);

          try {
            await supabase!.from('graphics').delete().eq('id', dup.id);
          } catch {
            // DB row delete optional
          }
        }
      } catch (err) {
        console.warn('Background gallery duplicate purge error:', err);
      }
    })();
  }

  const deduplicatedItems = Array.from(uniqueMap.values());

  return NextResponse.json({
    success: true,
    count: deduplicatedItems.length,
    items: deduplicatedItems,
  });
}
