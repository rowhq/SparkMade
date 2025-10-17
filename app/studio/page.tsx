import { BrandShell } from '@/components/brand/BrandShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudioForm } from '@/components/StudioForm';

export default async function StudioPage() {
  return (
    <BrandShell footer={false}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block px-3 py-1 mb-2 text-sm font-medium bg-brand-primary/10 text-brand-primary rounded-full">
              AI-Powered Creation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">AI Design Studio</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Describe your product idea and let AI generate a complete product brief, pricing strategy, and marketing copy. Your product goes live instantly for others to back.
            </p>
          </div>

          <StudioForm />

          <Card>
            <CardHeader>
              <CardTitle>Coming soon: Full Canvas</CardTitle>
              <CardDescription>
                Interactive design canvas with real-time AI chat, image generation, and
                spec editing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <p className="text-6xl">🎨</p>
                  <p className="font-medium">Studio Canvas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BrandShell>
  );
}
