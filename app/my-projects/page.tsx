import { BrandShell } from '@/components/brand/BrandShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function MyProjectsPage() {
  // For demo purposes, using demo-user
  // In production, this would use actual auth
  const userId = 'demo-user';

  const myProjects = await prisma.project.findMany({
    where: {
      creatorId: userId,
    },
    include: {
      pledges: {
        select: {
          amount: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const projectsWithStats = myProjects.map((project) => {
    const totalPledged = project.pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
    const fundingGoal = project.depositAmount * project.thresholdValue;
    const fundingProgress = Math.round((totalPledged / fundingGoal) * 100);
    const backersCount = project.pledges.length;

    return {
      ...project,
      totalPledged,
      fundingGoal,
      fundingProgress,
      backersCount,
    };
  });

  return (
    <BrandShell>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 mb-2 text-sm font-medium bg-brand-secondary/10 text-brand-secondary rounded-full">
              Your Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">My Projects</h1>
            <p className="text-lg text-muted-foreground">
              Manage your AI-generated products, track backing progress, and engage with your supporters.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/studio">Create New Product</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/explore">Browse Marketplace</Link>
              </Button>
            </div>
          </div>

          {/* Projects List */}
          {projectsWithStats.length > 0 ? (
            <div className="space-y-4">
              {projectsWithStats.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{project.status}</Badge>
                          <Badge>{project.category}</Badge>
                        </div>
                        <CardTitle className="text-2xl">
                          <Link href={`/projects/${project.id}`} className="hover:underline">
                            {project.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>{project.tagline}</CardDescription>
                      </div>
                      <Button asChild>
                        <Link href={`/projects/${project.id}`}>View Project</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{project.fundingProgress}%</div>
                        <div className="text-sm text-muted-foreground">Funded</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          ${(project.totalPledged / 100).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Raised</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{project.backersCount}</div>
                        <div className="text-sm text-muted-foreground">Backers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {Math.max(
                            0,
                            Math.ceil(
                              (new Date(project.deadlineAt).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Days Left</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🎨"
              title="No projects yet"
              description="You haven't created any projects yet. Start your journey by creating your first project!"
              action={{ label: 'Create your first project', href: '/studio' }}
            />
          )}
        </div>
      </div>
    </BrandShell>
  );
}
