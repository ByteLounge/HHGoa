import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from './constants';

export const builderInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(40, 'Name must be under 40 characters')
    .trim(),
  role: z
    .string()
    .min(1, 'Role / Stack is required')
    .max(50, 'Role must be under 50 characters')
    .trim(),
  company: z
    .string()
    .max(50, 'Company must be under 50 characters')
    .optional()
    .or(z.literal('')),
  college: z
    .string()
    .max(50, 'College must be under 50 characters')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(40, 'Location must be under 40 characters')
    .optional()
    .or(z.literal('')),
  builderTitle: z
    .string()
    .min(1, 'Builder Title is required')
    .max(50, 'Title must be under 50 characters')
    .trim(),
  customHashtag: z
    .string()
    .max(30, 'Hashtag must be under 30 characters')
    .optional()
    .or(z.literal('')),
});

export const imageUploadSchema = z.object({
  size: z.number().max(MAX_FILE_SIZE, 'Image size must be less than 15MB'),
  type: z
    .string()
    .refine(
      (type) => ACCEPTED_IMAGE_TYPES.includes(type.toLowerCase()),
      'Unsupported file format. Please upload JPG, PNG, WEBP, or HEIC/HEIF.'
    ),
});

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Image size exceeds 15MB limit. Please choose a smaller photo.' };
  }

  // Handle extension check for HEIC/HEIF if mime type is empty or generic
  const ext = file.name.split('.').pop()?.toLowerCase();
  const isHeicExt = ext === 'heic' || ext === 'heif';
  const isAcceptedType = ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase()) || isHeicExt;

  if (!isAcceptedType) {
    return {
      valid: false,
      error: 'Unsupported image format. Allowed formats: JPG, PNG, WEBP, HEIC, HEIF.',
    };
  }

  return { valid: true };
}
