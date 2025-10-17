'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function StudioForm() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ projectId?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idea.trim()) {
      setResult({ error: 'Please enter your product idea' });
      return;
    }

    setLoading(true);
    setResult(null);

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
              {loading ? 'Generating with AI...' : 'Generate with AI'}
            </Button>

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
                    Project created successfully!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your AI-generated product brief is ready. Redirecting to project page...
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`/projects/${result.projectId}`)}
                  className="w-full"
                >
                  View Project Now
                </Button>
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
