'use client';

import { BrandShell } from '@/components/brand/BrandShell';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <BrandShell>
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="text-lg text-muted-foreground">
            We're sorry, but something unexpected happened.
          </p>
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </BrandShell>
  );
}
