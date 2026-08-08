import { describe, it, expect } from 'vitest';
import { saveGraphicRecord, getGraphicRecord } from '../lib/storage';
import { GeneratedGraphicRecord } from '../types';

describe('Graphic Deduplication & Discard System', () => {
  it('should discard previous graphic record when a new pass with identical builder details is saved', async () => {
    const record1: GeneratedGraphicRecord = {
      id: 'dup-pass-uuid-1',
      type: 'card',
      imageDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      builderInfo: {
        name: 'Rohan Mehta',
        role: 'Solana Developer',
        builderTitle: 'The Chain Master',
        company: 'Goa Labs',
        location: 'Panaji, Goa',
        customHashtag: '#FrameInGoa',
      },
      themeId: 'hhgoa-editorial',
      createdAt: new Date('2026-08-08T10:00:00Z').toISOString(),
      shareUrl: 'https://hhgoa2026.vercel.app/card/dup-pass-uuid-1',
    };

    await saveGraphicRecord(record1);

    // Verify first pass exists
    const fetched1 = await getGraphicRecord('dup-pass-uuid-1');
    expect(fetched1).not.toBeNull();

    // Create second pass with same builder details but new ID & timestamp
    const record2: GeneratedGraphicRecord = {
      id: 'dup-pass-uuid-2',
      type: 'card',
      imageDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      builderInfo: {
        name: 'Rohan Mehta',
        role: 'Solana Developer',
        builderTitle: 'The Chain Master',
        company: 'Goa Labs',
        location: 'Panaji, Goa',
        customHashtag: '#FrameInGoa',
      },
      themeId: 'hhgoa-editorial',
      createdAt: new Date('2026-08-08T12:00:00Z').toISOString(),
      shareUrl: 'https://hhgoa2026.vercel.app/card/dup-pass-uuid-2',
    };

    await saveGraphicRecord(record2);

    // Verify first pass was discarded and second pass is kept
    const fetched1After = await getGraphicRecord('dup-pass-uuid-1');
    const fetched2After = await getGraphicRecord('dup-pass-uuid-2');

    expect(fetched1After).toBeNull();
    expect(fetched2After).not.toBeNull();
    expect(fetched2After?.id).toBe('dup-pass-uuid-2');
  });
});
