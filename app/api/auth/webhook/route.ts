import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { syncUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses[0]?.email_address;
    const name = first_name && last_name ? `${first_name} ${last_name}` : first_name;

    if (email) {
      await syncUser(id, email, name);
    }
  }

  return NextResponse.json({ message: 'Webhook processed' });
}
