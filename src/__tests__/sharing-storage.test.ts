import { describe, it, expect } from 'vitest';
import { saveGraphicRecord, getGraphicRecord } from '../lib/storage';
import { GeneratedGraphicRecord } from '../types';

describe('Unique X Sharing & Supabase Storage System', () => {
  it('should store and retrieve a unique Builder Pass record with user metadata', async () => {
    const testRecord: GeneratedGraphicRecord = {
      id: 'test-pass-uuid-101',
      type: 'card',
      imageDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      builderInfo: {
        name: 'Aarav Sharma',
        role: 'Full Stack Engineer',
        builderTitle: 'The Web3 Wizard',
        company: 'Goa Tech Labs',
        location: 'Panaji, Goa',
        customHashtag: '#FrameInGoa',
      },
      themeId: 'hhgoa-editorial',
      createdAt: new Date().toISOString(),
      shareUrl: 'https://hhgoa2026.vercel.app/card/test-pass-uuid-101',
    };

    await saveGraphicRecord(testRecord);

    const retrieved = await getGraphicRecord('test-pass-uuid-101');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe('test-pass-uuid-101');
    expect(retrieved?.type).toBe('card');
    expect(retrieved?.builderInfo.name).toBe('Aarav Sharma');
    expect(retrieved?.builderInfo.builderTitle).toBe('The Web3 Wizard');
    expect(retrieved?.imageDataUrl).toContain('data:image/png;base64,');
  });

  it('should store and retrieve a unique Profile Frame record with user metadata', async () => {
    const testRecord: GeneratedGraphicRecord = {
      id: 'test-frame-uuid-202',
      type: 'frame',
      imageDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      builderInfo: {
        name: 'Priya Patel',
        role: 'AI Researcher',
        builderTitle: 'Neural Architect',
        company: 'MindAI',
        location: 'Goa, India',
        customHashtag: '#FrameInGoa',
      },
      themeId: 'hhgoa-editorial',
      createdAt: new Date().toISOString(),
      shareUrl: 'https://hhgoa2026.vercel.app/frame/test-frame-uuid-202',
    };

    await saveGraphicRecord(testRecord);

    const retrieved = await getGraphicRecord('test-frame-uuid-202');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe('test-frame-uuid-202');
    expect(retrieved?.type).toBe('frame');
    expect(retrieved?.builderInfo.name).toBe('Priya Patel');
    expect(retrieved?.builderInfo.builderTitle).toBe('Neural Architect');
  });

  it('should return null when querying a non-existent graphic ID', async () => {
    const retrieved = await getGraphicRecord('non-existent-id-99999');
    expect(retrieved).toBeNull();
  });
});
