/**
 * Storage utility for S3-compatible services
 * Supports AWS S3, Cloudflare R2, Supabase Storage, etc.
 */

interface UploadResult {
  url: string;
  key: string;
}

/**
 * Upload a file to S3-compatible storage
 * This is a stub - implement with your preferred S3 SDK
 */
export async function uploadFile(
  file: File | Buffer,
  key: string,
  contentType?: string
): Promise<UploadResult> {
  // TODO: Implement with AWS SDK or compatible library
  // Example with AWS SDK:
  // const s3 = new S3Client({
  //   region: 'auto',
  //   endpoint: process.env.STORAGE_BUCKET_URL,
  //   credentials: {
  //     accessKeyId: process.env.STORAGE_ACCESS_KEY!,
  //     secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  //   },
  // });
  //
  // await s3.send(new PutObjectCommand({
  //   Bucket: process.env.STORAGE_BUCKET_NAME!,
  //   Key: key,
  //   Body: buffer,
  //   ContentType: contentType,
  // }));

  console.log('Storage upload stub called for:', key);

  return {
    url: `/uploads/${key}`,
    key,
  };
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
