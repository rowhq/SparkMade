/**
 * Storage utility using Vercel Blob
 */

import { put } from '@vercel/blob';

interface UploadResult {
  url: string;
  key: string;
}

/**
 * Upload a file to Vercel Blob storage
 */
export async function uploadFile(
  file: File | Buffer,
  key: string,
  contentType?: string
): Promise<UploadResult> {
  console.log('Uploading to Vercel Blob:', key);

  const blob = await put(key, file, {
    access: 'public',
    contentType: contentType || 'application/octet-stream',
  });

  console.log('Upload complete:', blob.url);

  return {
    url: blob.url,
    key: key,
  };
}

/**
 * Upload an image buffer to Vercel Blob
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const result = await uploadFile(buffer, filename, 'image/png');
  return result.url;
}

/**
 * Generate a signed URL for temporary access
 */
export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  // TODO: Implement signed URL generation
  console.log('Signed URL stub called for:', key);
  return `/uploads/${key}`;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  // TODO: Implement file deletion
  console.log('Delete stub called for:', key);
}
