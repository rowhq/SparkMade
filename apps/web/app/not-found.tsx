import { BrandShell } from '@/components/brand/BrandShell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <BrandShell>
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-3xl font-semibold">Page not found</h2>
          <p className="text-lg text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link href="/">
            <Button size="lg">Go home</Button>
          </Link>
        </div>
      </div>
    </BrandShell>
  );
}
