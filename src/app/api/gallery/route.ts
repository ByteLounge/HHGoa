import { NextResponse } from 'next/server';
import { supabase, BUCKET_NAME } from '@/lib/supabase';

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
    lowerId.startsWith('non-existent') ||
    lowerId.includes('uuid-')
  ) {
    return true;
  }

  if (builderName) {
    const lowerName = builderName.toLowerCase();
    if (
      lowerName.includes('abcdef') ||
      lowerName.includes('john doe') ||
      lowerName.includes('test user')
    ) {
      return true;
    }
  }

  return false;
}

export async function GET() {
  const items: GalleryItem[] = [];

  // Fetch only legitimate user-generated graphics from Supabase Storage
  if (supabase) {
    try {
      // 1. Fetch Cards from Supabase Storage
      const { data: cardFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('cards', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });

      if (cardFiles && cardFiles.length > 0) {
        for (const file of cardFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');
            
            // Skip dummy test IDs
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
              // Metadata read fail, skip unverified file
            }

            // Skip if builderName matches dummy patterns
            if (isDummyOrTestItem(id, builderName)) continue;

            items.push({
              id,
              type: 'card',
              imageUrl: publicUrl,
              shareUrl: `/card/${id}`,
              createdAt: file.created_at || new Date().toISOString(),
              builderName,
              builderTitle,
              builderRole,
              builderCompany,
            });
          }
        }
      }

      // 2. Fetch Frames from Supabase Storage
      const { data: frameFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('frames', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });

      if (frameFiles && frameFiles.length > 0) {
        for (const file of frameFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');

            // Skip dummy test IDs
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
              // Metadata read fail, skip unverified file
            }

            // Skip if builderName matches dummy patterns
            if (isDummyOrTestItem(id, builderName)) continue;

            items.push({
              id,
              type: 'frame',
              imageUrl: publicUrl,
              shareUrl: `/frame/${id}`,
              createdAt: file.created_at || new Date().toISOString(),
              builderName,
              builderTitle,
              builderRole,
              builderCompany,
            });
          }
        }
      }
    } catch (err) {
      console.warn('Gallery Supabase listing error:', err);
    }
  }

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Deduplicate items: Keep only the latest entry per unique builder identity + type
  const uniqueMap = new Map<string, GalleryItem>();
  const duplicateIdsToRemove: { id: string; type: 'card' | 'frame' }[] = [];

  for (const item of items) {
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
