'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy, Share2, Loader2, Sparkles, FileText, DollarSign, Wand2 } from 'lucide-react';

const GENERATION_STEPS = [
  { icon: Sparkles, label: 'Analyzing your idea', duration: 2000 },
  { icon: FileText, label: 'Generating product brief', duration: 3000 },
  { icon: DollarSign, label: 'Calculating pricing strategy', duration: 2000 },
  { icon: Wand2, label: 'Writing marketing copy', duration: 2500 },
  { icon: Check, label: 'Finalizing details', duration: 1500 },
];

export function StudioForm() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<{ projectId?: string; error?: string; demo?: boolean; data?: any; message?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Simulate progress through generation steps
  useEffect(() => {
    if (!loading) {
      setCurrentStep(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2500);

    return () => clearInterval(stepInterval);
  }, [loading]);

  const copyShareLink = (projectId: string) => {
    const url = `${window.location.origin}/product/${projectId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: 'twitter' | 'facebook' | 'linkedin', projectId: string) => {
    const url = `${window.location.origin}/product/${projectId}`;
    const text = 'Check out my new product idea!';

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idea.trim()) {
      setResult({ error: 'Please enter your product idea' });
      return;
    }

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      console.log('Sending request to API...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch('/api/ai/projects/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: idea }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Received response:', response.status);

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to generate project');
        setResult({ error: errorMsg });
      } else if (data.demo) {
        // Demo mode: show generated data without redirect
        setResult({ demo: true, data: data.data, message: data.message });
      } else {
        setResult({ projectId: data.projectId });
        // Redirect to project page after 2 seconds
        setTimeout(() => {
          router.push(`/projects/${data.projectId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        setResult({ error: 'Request timed out after 60 seconds. The AI generation is taking longer than expected.' });
      } else {
        setResult({ error: 'Network error. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start a new project</CardTitle>
          <CardDescription>
            Describe your product idea in a few sentences. Our AI will generate a
            complete design brief, specifications, and realistic renders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="idea">Your idea</Label>
              <Textarea
                id="idea"
                placeholder="Example: A portable desk organizer made from bamboo with compartments for pens, paper clips, and sticky notes..."
                rows={6}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                'Generate with AI'
              )}
            </Button>

            {loading && (
              <div className="p-6 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/20 rounded-lg space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
                </div>
                <div className="space-y-3">
                  {GENERATION_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-brand-primary/10 scale-105'
                            : isCompleted
                            ? 'bg-green-500/10'
                            : 'bg-secondary/50'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 ${
                            isActive
                              ? 'text-brand-primary'
                              : isCompleted
                              ? 'text-green-600'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isActive
                              ? 'text-brand-primary'
                              : isCompleted
                              ? 'text-green-700'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-sm text-muted-foreground pt-2">
                  This usually takes 10-15 seconds...
                </p>
              </div>
            )}

            {result?.error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-sm">
                <p className="font-medium text-destructive mb-2">Error</p>
                <p className="text-destructive">{result.error}</p>
                {result.error.includes('ANTHROPIC_API_KEY') && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    To enable AI generation, add your Anthropic API key to <code className="bg-muted px-1 py-0.5 rounded">apps/web/.env.local</code>
                  </p>
                )}
              </div>
            )}

            {result?.projectId && (
              <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg space-y-4">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-2">
                    🎉 Product is live and ready to share!
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your AI-generated product is now live. Share it with friends so they can back it!
                  </p>

                  {/* Share Link */}
                  <div className="bg-white/50 border rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs text-muted-foreground flex-1 overflow-hidden text-ellipsis">
                        {window.location.origin}/product/{result.projectId}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyShareLink(result.projectId!)}
                        className="flex-shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Link
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareOnSocial('twitter', result.projectId!)}
                      className="flex-1"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Twitter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareOnSocial('facebook', result.projectId!)}
                      className="flex-1"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Facebook
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareOnSocial('linkedin', result.projectId!)}
                      className="flex-1"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      LinkedIn
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/product/${result.projectId}`)}
                  className="w-full"
                >
                  View Product Page
                </Button>
              </div>
            )}

            {result?.demo && result?.data && (
              <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg space-y-4">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-2">
                    AI Generation Successful! (Demo Mode)
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {result.message}
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">Title:</p>
                    <p className="text-muted-foreground">{result.data.title}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Tagline:</p>
                    <p className="text-muted-foreground">{result.data.tagline}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Category:</p>
                    <p className="text-muted-foreground">{result.data.category}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Features:</p>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {result.data.features?.map((feature: string, i: number) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Estimated Cost:</p>
                    <p className="text-muted-foreground">${result.data.estimatedCost}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Suggested Deposit:</p>
                    <p className="text-muted-foreground">${(result.data.depositCents / 100).toFixed(2)}</p>
                  </div>
                </div>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <p>To save projects and access full features, configure a DATABASE_URL in your environment variables.</p>
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">What happens next:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>AI creates a product brief with features and materials</li>
                <li>Generates photorealistic renders</li>
                <li>Produces manufacturing specifications</li>
                <li>Suggests pricing and funding targets</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
