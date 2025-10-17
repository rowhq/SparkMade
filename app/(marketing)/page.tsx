import { BrandShell } from '@/components/brand/BrandShell';
import { Hero } from '@/components/brand/Hero';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { COPY } from '@/contracts';

export default async function HomePage() {
  // Database not configured yet - showing demo UI only
  const featuredProjects: any[] = [];

  return (
    <BrandShell>
      <Hero
        title="Bring new products to life."
        subtitle={COPY.positioningMessage}
        primaryCta={{ label: 'Design with AI', href: '/studio' }}
        secondaryCta={{ label: 'Explore ideas', href: '/explore' }}
      />

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6 space-y-4">
                <div className="text-5xl mb-4">✍️</div>
                <h3 className="text-xl font-semibold">Describe</h3>
                <p className="text-muted-foreground">
                  Tell our AI what product you want to create. It handles the design,
                  specs, and manufacturing plan.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 space-y-4">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-semibold">Deposit</h3>
                <p className="text-muted-foreground">
                  Backers place refundable deposits. If the goal isn't met, everyone
                  gets refunded automatically.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 space-y-4">
                <div className="text-5xl mb-4">🏭</div>
                <h3 className="text-xl font-semibold">Produce</h3>
                <p className="text-muted-foreground">
                  When the goal is hit, we match you with manufacturers and manage
                  production milestones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Live projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {featuredProjects.map((project) => (
                <ProductCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  tagline={project.tagline}
                  heroImage={project.heroImages[0]}
                  depositAmount={project.depositAmount}
                  priceTarget={project.priceTarget}
                  thresholdValue={project.thresholdValue}
                  deadlineAt={project.deadlineAt}
                  category={project.category}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to bring your idea to life?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start designing with AI. No experience required.
            </p>
          </div>
        </div>
      </section>
    </BrandShell>
  );
}
