import { NextRequest, NextResponse } from 'next/server';
import { startDraft } from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Demo mode: use a test user ID
    const userId = 'demo-user';

    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Start AI draft generation
    const projectId = await startDraft(userId, text);

    return NextResponse.json({ projectId }, { status: 201 });
  } catch (error) {
    console.error('Error creating draft:', error);
    return NextResponse.json(
      { error: 'Failed to create draft', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
