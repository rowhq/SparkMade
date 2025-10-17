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

// Dummy data for when database is not available
const DUMMY_PROJECTS = [
  {
    id: '1',
    title: 'EcoBottle Pro',
    tagline: 'The smart water bottle that tracks your hydration',
    heroImages: [],
    depositAmount: 2500,
    priceTarget: 4900,
    currentFunding: 15000,
    thresholdValue: 100,
    deadlineAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: 'Health & Fitness',
  },
  {
    id: '2',
    title: 'UrbanGarden Kit',
    tagline: 'Grow fresh herbs in your apartment',
    heroImages: [],
    depositAmount: 3500,
    priceTarget: 7900,
    currentFunding: 28000,
    thresholdValue: 75,
    deadlineAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    category: 'Home & Garden',
  },
  {
    id: '3',
    title: 'FocusPods',
    tagline: 'Noise-cancelling earbuds designed for deep work',
    heroImages: [],
    depositAmount: 4900,
    priceTarget: 12900,
    currentFunding: 65000,
    thresholdValue: 200,
    deadlineAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    category: 'Electronics',
  },
  {
    id: '4',
    title: 'MinimalDesk',
    tagline: 'Standing desk that fits any space',
    heroImages: [],
    depositAmount: 9900,
    priceTarget: 29900,
    currentFunding: 125000,
    thresholdValue: 50,
    deadlineAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    category: 'Furniture',
  },
  {
    id: '5',
    title: 'TravelPack Ultra',
    tagline: 'The only backpack you need for any trip',
    heroImages: [],
    depositAmount: 5900,
    priceTarget: 14900,
    currentFunding: 89000,
    thresholdValue: 150,
    deadlineAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    category: 'Travel',
  },
  {
    id: '6',
    title: 'ChefKnife Pro',
    tagline: 'Japanese steel knife for home chefs',
    heroImages: [],
    depositAmount: 3900,
    priceTarget: 8900,
    currentFunding: 42000,
    thresholdValue: 100,
    deadlineAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    category: 'Kitchen',
  },
];

const DUMMY_CATEGORIES = ['Health & Fitness', 'Home & Garden', 'Electronics', 'Furniture', 'Travel', 'Kitchen'];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let projectsWithFunding: any[] = [];
  let categories: string[] = [];

  try {
    // Try to fetch from database
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
    projectsWithFunding = projects.map((project) => {
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

    categories = Array.from(new Set(allProjects.map((p) => p.category))).sort();
  } catch (error) {
    // Use dummy data if database is not available
    console.warn('Database not available, using dummy data:', error);
    projectsWithFunding = searchParams.category
      ? DUMMY_PROJECTS.filter((p) => p.category === searchParams.category)
      : DUMMY_PROJECTS;
    categories = DUMMY_CATEGORIES;
  }

  return (
    <BrandShell>
      <div className="py-12 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-brand-primary/10 text-brand-primary rounded-full">
              Product Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore & Back Products</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover innovative products from creators around the world. Reserve your spot with a refundable deposit and help bring great ideas to life.
            </p>
          </div>
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
