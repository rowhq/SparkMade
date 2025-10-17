import { BrandShell } from '@/components/brand/BrandShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ContributePage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          name: true,
        },
      },
      pledges: {
        select: {
          amount: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const totalPledged = project.pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
  const fundingGoal = project.depositAmount * project.thresholdValue;
  const fundingProgress = Math.round((totalPledged / fundingGoal) * 100);
  const backersCount = project.pledges.length;

  return (
    <BrandShell>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Back link */}
          <Link
            href={`/projects/${project.id}`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            ← Back to project
          </Link>

          {/* Project Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{project.status}</Badge>
              <Badge>{project.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.tagline}</p>
            <p className="text-sm text-muted-foreground">
              Created by <span className="font-medium text-foreground">{project.creator.name}</span>
            </p>
          </div>

          {/* Contribution Options */}
          <Card>
            <CardHeader>
              <CardTitle>Back this project</CardTitle>
              <CardDescription>
                Secure your pre-order with a refundable deposit. If the project doesn't reach its
                funding goal, you'll get a full refund.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Standard Pledge */}
              <Card className="border-2 border-primary">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${(project.depositAmount / 100).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">deposit</span>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Includes</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✓ One {project.title}</li>
                      <li>✓ Early backer pricing at ${(project.priceTarget / 100).toFixed(2)}</li>
                      <li>✓ Priority shipping when manufactured</li>
                      <li>✓ Exclusive project updates</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>
                        <strong>How it works:</strong> Your deposit of $
                        {(project.depositAmount / 100).toFixed(2)} secures your pre-order. If the
                        project reaches its funding goal of {project.thresholdValue} backers, you'll
                        pay the remaining ${((project.priceTarget - project.depositAmount) / 100).toFixed(2)} before shipping.
                        If it doesn't reach the goal, your deposit is fully refunded.
                      </p>
                    </div>
                    <Button size="lg" className="w-full">
                      Pledge ${(project.depositAmount / 100).toFixed(2)}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Multiple Units */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${((project.depositAmount * 3) / 100).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">deposit</span>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Includes</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✓ Three {project.title}s</li>
                      <li>✓ Save 5% on final price</li>
                      <li>✓ All rewards from standard pledge</li>
                    </ul>
                  </div>

                  <Button size="lg" className="w-full" variant="outline">
                    Pledge ${((project.depositAmount * 3) / 100).toFixed(2)}
                  </Button>
                </CardContent>
              </Card>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{fundingProgress}%</div>
                  <div className="text-sm text-muted-foreground">funded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{backersCount}</div>
                  <div className="text-sm text-muted-foreground">backers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(project.deadlineAt).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">days left</div>
                </div>
              </div>

              {/* Note */}
              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <p className="font-medium mb-2">🔒 Secure & Protected</p>
                <p>
                  Your deposit is held in escrow and only released to the creator when manufacturing
                  milestones are met. If the project doesn't reach its goal, you get a full refund.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BrandShell>
  );
}
