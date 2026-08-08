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
}

export async function GET() {
  const items: GalleryItem[] = [];

  // 1. Fetch from Supabase Storage if configured
  if (supabase) {
    try {
      // Fetch cards
      const { data: cardFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('cards', { limit: 20, sortBy: { column: 'name', order: 'desc' } });

      if (cardFiles && cardFiles.length > 0) {
        for (const file of cardFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');
            const publicUrl = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`cards/${file.name}`).data.publicUrl;

            items.push({
              id,
              type: 'card',
              imageUrl: publicUrl,
              shareUrl: `/card/${id}`,
              createdAt: file.created_at || new Date().toISOString(),
            });
          }
        }
      }

      // Fetch frames
      const { data: frameFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('frames', { limit: 20, sortBy: { column: 'name', order: 'desc' } });

      if (frameFiles && frameFiles.length > 0) {
        for (const file of frameFiles) {
          if (file.name.endsWith('.png')) {
            const id = file.name.replace('.png', '');
            const publicUrl = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`frames/${file.name}`).data.publicUrl;

            items.push({
              id,
              type: 'frame',
              imageUrl: publicUrl,
              shareUrl: `/frame/${id}`,
              createdAt: file.created_at || new Date().toISOString(),
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

  return NextResponse.json({
    success: true,
    count: items.length,
    items,
  });
}
