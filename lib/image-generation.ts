/**
 * Image generation using Stability AI
 */

const STABILITY_API_KEY = process.env.STABILITY_API_KEY || '';
const STABILITY_API_HOST = 'https://api.stability.ai';

/**
 * Generate a product image using Stability AI
 * @param prompt - Image generation prompt from Claude
 * @returns Buffer of the generated image
 */
export async function generateProductImage(prompt: string): Promise<Buffer> {
  if (!STABILITY_API_KEY || STABILITY_API_KEY === '') {
    throw new Error('STABILITY_API_KEY is not configured');
  }

  console.log('Generating image with Stability AI...');

  // Create FormData for multipart/form-data request
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('output_format', 'png');
  formData.append('aspect_ratio', '16:9');

  const response = await fetch(
    `${STABILITY_API_HOST}/v2beta/stable-image/generate/ultra`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*',
        // Don't set Content-Type - let fetch set it with proper boundary
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Stability AI error:', errorText);
    throw new Error(`Stability AI failed: ${response.status} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`Generated image: ${buffer.length} bytes`);

  return buffer;
}
