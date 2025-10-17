'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';

interface ShareButtonProps {
  projectId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function ShareButton({
  projectId,
  variant = 'outline',
  size = 'default',
  showLabel = true,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyShareLink = () => {
    const url = `${window.location.origin}/product/${projectId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant={variant} size={size} onClick={copyShareLink} className={className}>
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          {showLabel && 'Copied!'}
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          {showLabel && 'Share'}
        </>
      )}
    </Button>
  );
}
