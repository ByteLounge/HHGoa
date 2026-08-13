import { describe, test, expect } from 'vitest';
import { builderInfoSchema, validateImageFile } from '../lib/validation';

describe('Validation Schemas', () => {
  test('validates correct builder info schema', () => {
    const validData = {
      name: 'Alex Rivera',
      role: 'Full Stack Engineer',
      builderTitle: 'The AI Architect',
      company: 'NextGen Lab',
      location: 'Goa',
    };

    const result = builderInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('fails builder info validation when name is empty', () => {
    const invalidData = {
      name: '',
      role: 'Full Stack Engineer',
      builderTitle: 'The AI Architect',
    };

    const result = builderInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('validates image file size limit', () => {
    const validFile = new File(['dummy content'], 'photo.png', { type: 'image/png' });
    const validation = validateImageFile(validFile);
    expect(validation.valid).toBe(true);
  });
});
