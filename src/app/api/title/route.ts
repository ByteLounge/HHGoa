import { NextRequest, NextResponse } from 'next/server';
import { generateBuilderTitle, getAllTitleSuggestions } from '@/lib/title-generator';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') || '';
  const seedParam = searchParams.get('seed');
  const seed = seedParam ? parseInt(seedParam, 10) : undefined;

  const title = generateBuilderTitle(role, seed);
  const suggestions = getAllTitleSuggestions(role);

  return NextResponse.json({
    title,
    suggestions,
  });
}
