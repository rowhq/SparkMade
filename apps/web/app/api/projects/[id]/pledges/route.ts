import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createDepositIntent } from '@/lib/stripe';
import { sendDepositConfirmed } from '@/lib/email';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;
    const body = await req.json();
    const { amount } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.status !== 'LIVE') {
      return NextResponse.json(
        { error: 'Project is not accepting deposits' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create Stripe payment intent
    const paymentIntent = await createDepositIntent(amount, projectId, userId);

    // Create pledge record
    const pledge = await prisma.pledge.create({
      data: {
        projectId,
        backerId: userId,
        amount,
        status: 'PENDING',
        paymentIntent: paymentIntent.id,
        escrowId: paymentIntent.id, // Using payment intent ID as escrow ID for now
      },
    });

    // Send confirmation email
    await sendDepositConfirmed(
      user.email,
      user.name || 'there',
      project.title,
      amount
    );

    return NextResponse.json(
      {
        pledgeId: pledge.id,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating pledge:', error);
    return NextResponse.json(
      { error: 'Failed to create pledge' },
      { status: 500 }
    );
  }
}
