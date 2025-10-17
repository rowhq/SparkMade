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

  const response = await fetch(
    `${STABILITY_API_HOST}/v2beta/stable-image/generate/ultra`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*',
      },
      body: new URLSearchParams({
        prompt: prompt,
        output_format: 'png',
        aspect_ratio: '16:9',
      }),
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
