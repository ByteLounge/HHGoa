import { NextResponse } from 'next/server';
import { supabase, BUCKET_NAME } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

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

export async function GET() {
  const items: GalleryItem[] = [];

  // 1. Fetch from Supabase Storage if configured
  if (supabase) {
    try {
      // Fetch cards
      const { data: cardFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('cards', { limit: 50, sortBy: { column: 'name', order: 'desc' } });

      if (cardFiles && cardFiles.length > 0) {
        for (const file of cardFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');
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
              // Ignore metadata fetch error
            }

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

      // Fetch frames
      const { data: frameFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('frames', { limit: 50, sortBy: { column: 'name', order: 'desc' } });

      if (frameFiles && frameFiles.length > 0) {
        for (const file of frameFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');
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
              // Ignore metadata fetch error
            }

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

  // 2. Fallback to local server graphics folder if items array is empty
  if (items.length === 0) {
    try {
      const graphicsDir = path.join(process.cwd(), 'data', 'graphics');
      if (fs.existsSync(graphicsDir)) {
        const files = await fs.promises.readdir(graphicsDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const jsonPath = path.join(graphicsDir, file);
            const content = await fs.promises.readFile(jsonPath, 'utf-8');
            const meta = JSON.parse(content);
            const type = meta.type || (file.startsWith('frame') ? 'frame' : 'card');
            
            items.push({
              id: meta.id,
              type,
              imageUrl: `/api/og?id=${meta.id}&type=${type}`,
              shareUrl: meta.shareUrl || `/${type}/${meta.id}`,
              createdAt: meta.createdAt || new Date().toISOString(),
              builderName: meta.builderInfo?.name,
              builderTitle: meta.builderInfo?.builderTitle,
              builderRole: meta.builderInfo?.role,
              builderCompany: meta.builderInfo?.company || meta.builderInfo?.college,
            });
          }
        }
      }
    } catch (err) {
      console.warn('Gallery disk listing fallback error:', err);
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
