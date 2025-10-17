import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BrandShell } from '@/components/brand/BrandShell';
import { DepositWidget } from '@/components/DepositWidget';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import type { ProductBrief } from '@/contracts';

async function getProject(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      creator: true,
      pledges: true,
      updates: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  const brief = project.aiBriefJson as unknown as ProductBrief;
  const currentReservations = project.pledges.filter((p) => p.status === 'HELD').length;

  return (
    <BrandShell>
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image */}
            <div className="aspect-[16/10] relative rounded-2xl overflow-hidden bg-secondary">
              {project.heroImages[0] ? (
                <Image
                  src={project.heroImages[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-9xl">📦</span>
                </div>
              )}
            </div>

            {/* Title and description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge>{project.category}</Badge>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
              <p className="text-xl text-muted-foreground">{project.tagline}</p>
            </div>

            <Separator />

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p>{project.description}</p>
            </div>

            {/* Features */}
            {brief.features && brief.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {brief.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-primary mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Specs */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {brief.materials && (
                  <div>
                    <span className="font-medium">Materials: </span>
                    <span className="text-muted-foreground">
                      {brief.materials.join(', ')}
                    </span>
                  </div>
                )}
                {brief.dimensions && (
                  <div>
                    <span className="font-medium">Dimensions: </span>
                    <span className="text-muted-foreground">{brief.dimensions}</span>
                  </div>
                )}
                {brief.design_style && (
                  <div>
                    <span className="font-medium">Design style: </span>
                    <span className="text-muted-foreground">{brief.design_style}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Updates */}
            {project.updates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.updates.map((update) => (
                    <div key={update.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{update.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(update.createdAt)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{update.body}</p>
                      <Separator className="!mt-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DepositWidget
              projectId={project.id}
              depositAmount={project.depositAmount}
              currentReservations={currentReservations}
              thresholdValue={project.thresholdValue}
              deadlineAt={project.deadlineAt}
              priceTarget={project.priceTarget}
              status={project.status}
            />
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
