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

    // Check if database is configured
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          details: 'The AI Studio requires a database connection. Please configure DATABASE_URL in your environment variables to use this feature.'
        },
        { status: 503 }
      );
    }

    // Start AI draft generation
    const projectId = await startDraft(userId, text);

    return NextResponse.json({ projectId }, { status: 201 });
  } catch (error) {
    console.error('Error creating draft:', error);

    // Check for database-specific errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('does not exist') || errorMessage.includes('database')) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          details: 'The AI Studio requires a database connection. Please configure your database to use this feature.'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create draft', details: errorMessage },
      { status: 500 }
    );
  }
}
