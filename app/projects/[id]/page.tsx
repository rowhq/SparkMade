import { BrandShell } from '@/components/brand/BrandShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { ProductBrief } from '@/contracts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      creator: true,
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

  const brief = project.aiBriefJson as unknown as ProductBrief;

  // Calculate funding progress
  const totalPledged = project.pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
  const fundingGoal = project.depositAmount * project.thresholdValue;
  const fundingProgress = Math.round((totalPledged / fundingGoal) * 100);
  const backersCount = project.pledges.length;

  const daysLeft = Math.ceil((new Date(project.deadlineAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <BrandShell>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{project.status}</Badge>
              <Badge>{project.category}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.tagline}</p>
            <p className="text-sm text-muted-foreground">
              Created by <span className="font-medium text-foreground">{project.creator.name}</span>
            </p>
          </div>

          {/* Funding Progress */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold">
                        ${(totalPledged / 100).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        pledged of ${(fundingGoal / 100).toLocaleString()} goal
                      </span>
                    </div>
                    <Progress value={Math.min(fundingProgress, 100)} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{fundingProgress}%</div>
                      <div className="text-sm text-muted-foreground">funded</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{backersCount}</div>
                      <div className="text-sm text-muted-foreground">backers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{daysLeft > 0 ? daysLeft : 0}</div>
                      <div className="text-sm text-muted-foreground">days to go</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full" asChild>
                    <Link href={`/projects/${project.id}/contribute`}>
                      Back this project
                    </Link>
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Deposit ${(project.depositAmount / 100).toFixed(2)} to secure your pre-order
                  </div>
                  {project.status === 'LIVE' && daysLeft <= 0 && (
                    <Badge variant="destructive" className="text-center">
                      Campaign Ended
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Brief */}
          <Card>
            <CardHeader>
              <CardTitle>Product Brief</CardTitle>
              <CardDescription>AI-generated product concept and specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Problem Statement</h3>
                <p className="text-muted-foreground">{brief.problem}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Target Audience</h3>
                <p className="text-muted-foreground">{brief.audience}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {brief.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {brief.materials.map((material, idx) => (
                    <Badge key={idx} variant="secondary">{material}</Badge>
                  ))}
                </div>
              </div>

              {brief.dimensions && (
                <div>
                  <h3 className="font-semibold mb-2">Dimensions</h3>
                  <p className="text-muted-foreground">{brief.dimensions}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="font-semibold mb-1">Design Style</h3>
                  <p className="text-sm text-muted-foreground">{brief.design_style}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Manufacturing Risk</h3>
                  <Badge variant={brief.manufacturing_risk === 'low' ? 'default' : 'destructive'}>
                    {brief.manufacturing_risk.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Details */}
          <Card>
            <CardHeader>
              <CardTitle>Funding Details</CardTitle>
              <CardDescription>AI-suggested pricing and funding targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-1">Estimated Cost</h3>
                  <p className="text-2xl font-bold">${brief.estimated_cost.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Deposit Amount</h3>
                  <p className="text-2xl font-bold">${(project.depositAmount / 100).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Price Target</h3>
                  <p className="text-2xl font-bold">${(project.priceTarget / 100).toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Funding Goal</h3>
                <p className="text-muted-foreground">
                  {project.thresholdType === 'UNITS' ? (
                    <>{project.thresholdValue} units needed to proceed with manufacturing</>
                  ) : (
                    <>${(project.thresholdValue / 100).toLocaleString()} in total deposits needed</>
                  )}
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Campaign Deadline</h3>
                <p className="text-muted-foreground">
                  {new Date(project.deadlineAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
            </CardContent>
          </Card>

          {/* Tags */}
          {project.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </BrandShell>
  );
}
