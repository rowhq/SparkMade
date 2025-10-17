import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { refundPaymentIntent } from '@/lib/stripe';
import { sendProjectRefunded } from '@/lib/email';

/**
 * Cron job to check for missed deadlines and auto-refund
 * Should be called daily via Vercel Cron or similar
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find all LIVE projects past deadline
    const missedProjects = await prisma.project.findMany({
      where: {
        status: 'LIVE',
        deadlineAt: {
          lt: now,
        },
      },
      include: {
        pledges: {
          where: {
            status: 'HELD',
          },
          include: {
            backer: true,
          },
        },
      },
    });

    console.log(`Found ${missedProjects.length} projects past deadline`);

    for (const project of missedProjects) {
      console.log(`Processing refunds for project ${project.id}`);

      // Refund all held pledges
      for (const pledge of project.pledges) {
        try {
          await refundPaymentIntent(pledge.paymentIntent);

          await prisma.pledge.update({
            where: { id: pledge.id },
            data: {
              status: 'REFUNDED',
              refundedAt: new Date(),
            },
          });

          // Send refund email
          await sendProjectRefunded(
            pledge.backer.email,
            pledge.backer.name || 'there',
            project.title,
            pledge.amount
          );

          console.log(`Refunded pledge ${pledge.id}`);
        } catch (error) {
          console.error(`Error refunding pledge ${pledge.id}:`, error);
        }
      }

      // Update project status
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: 'CANCELED',
        },
      });
    }

    return NextResponse.json({
      message: 'Deadline check complete',
      refundedProjects: missedProjects.length,
    });
  } catch (error) {
    console.error('Error in deadline check:', error);
    return NextResponse.json(
      { error: 'Failed to process deadline check' },
      { status: 500 }
    );
  }
}
