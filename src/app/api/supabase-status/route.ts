import { NextResponse } from 'next/server';
import { supabase, BUCKET_NAME } from '@/lib/supabase';

export async function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasAnonKey = !!(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY
  );

  if (!supabase) {
    return NextResponse.json({
      connected: false,
      bucket: BUCKET_NAME,
      hasUrl: !!supabaseUrl,
      hasServiceRoleKey,
      hasAnonKey,
      error:
        'Supabase environment variables missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).',
      sqlHelp: `
-- Run this in Supabase SQL Editor if storage uploads fail:
INSERT INTO storage.buckets (id, name, public) VALUES ('hhgoa-graphics', 'hhgoa-graphics', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'hhgoa-graphics');
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hhgoa-graphics');
CREATE POLICY "Public Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'hhgoa-graphics');
      `.trim(),
    });
  }

  let bucketExists = false;
  let bucketError: string | null = null;

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      bucketError = error.message;
    } else {
      bucketExists = buckets?.some((b) => b.name === BUCKET_NAME) || false;
    }
  } catch (err: unknown) {
    bucketError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    connected: true,
    bucket: BUCKET_NAME,
    bucketExists,
    bucketError,
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey,
    hasAnonKey,
    sqlHelp: `
-- Run this in Supabase SQL Editor if storage uploads fail:
INSERT INTO storage.buckets (id, name, public) VALUES ('hhgoa-graphics', 'hhgoa-graphics', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'hhgoa-graphics');
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hhgoa-graphics');
CREATE POLICY "Public Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'hhgoa-graphics');
    `.trim(),
  });
}
