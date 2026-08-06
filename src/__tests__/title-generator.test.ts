import { describe, test, expect } from 'vitest';
import { generateBuilderTitle, getAllTitleSuggestions } from '../lib/title-generator';

describe('Title Generator Library', () => {
  test('returns matching title for AI keyword', () => {
    const title = generateBuilderTitle('Senior AI Researcher', 0);
    expect(title).toBe('The AI Architect');
  });

  test('returns matching title for Frontend keyword', () => {
    const title = generateBuilderTitle('React Frontend Developer', 0);
    expect(title).toBe('Frontend Wizard');
  });

  test('returns fallback title when role has no keyword', () => {
    const title = generateBuilderTitle('Quantum Physicist', 1);
    expect(typeof title).toBe('string');
    expect(title.length).toBeGreaterThan(0);
  });

  test('returns title suggestions list', () => {
    const suggestions = getAllTitleSuggestions('Fullstack React Developer');
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(5);
  });
});
