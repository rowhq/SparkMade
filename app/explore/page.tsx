import { BrandShell } from '@/components/brand/BrandShell';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { ProductCard } from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SearchParams {
  category?: string;
  status?: string;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Fetch LIVE projects from database
  const whereClause: any = {
    status: 'LIVE',
  };

  if (searchParams.category) {
    whereClause.category = searchParams.category;
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
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
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate funding for each project
  const projectsWithFunding = projects.map((project) => {
    const currentFunding = project.pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
    return {
      ...project,
      currentFunding,
    };
  });

  // Get unique categories
  const allProjects = await prisma.project.findMany({
    where: { status: 'LIVE' },
    select: {
      category: true,
    },
  });

  const categories = Array.from(new Set(allProjects.map((p) => p.category))).sort();

  return (
    <BrandShell>
      <div className="py-12 bg-secondary/20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover new product ideas from creators around the world.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Pill>
              <a href="/explore">All</a>
            </Pill>
            {categories.map((category) => (
              <Pill key={category}>
                <a href={`/explore?category=${encodeURIComponent(category)}`}>
                  {category}
                </a>
              </Pill>
            ))}
          </div>
        )}

        {/* Projects grid */}
        <Suspense fallback={<div>Loading...</div>}>
          {projectsWithFunding.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsWithFunding.map((project) => (
                <ProductCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  tagline={project.tagline}
                  heroImage={project.heroImages[0]}
                  depositAmount={project.depositAmount}
                  priceTarget={project.priceTarget}
                  currentFunding={project.currentFunding}
                  thresholdValue={project.thresholdValue}
                  deadlineAt={project.deadlineAt}
                  category={project.category}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="No projects found"
              description="There are no live projects at the moment. Check back soon or create your own!"
              action={{ label: 'Create a project', href: '/studio' }}
            />
          )}
        </Suspense>
      </div>
    </BrandShell>
  );
}
