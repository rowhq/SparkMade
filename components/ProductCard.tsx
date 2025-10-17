'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, daysUntil } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  tagline: string;
  heroImage?: string;
  depositAmount: number;
  priceTarget: number;
  currentFunding?: number;
  thresholdValue: number;
  deadlineAt: Date | string;
  category: string;
}

export function ProductCard({
  id,
  title,
  tagline,
  heroImage,
  depositAmount,
  priceTarget,
  currentFunding = 0,
  thresholdValue,
  deadlineAt,
  category,
}: ProductCardProps) {
  const days = daysUntil(deadlineAt);
  const progress = (currentFunding / (depositAmount * thresholdValue)) * 100;

  return (
    <Link href={`/projects/${id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="overflow-hidden cursor-pointer group">
          <div className="aspect-[4/3] relative bg-secondary overflow-hidden">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={title}
                fill
                className="object-cover transition-apple group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {days}d left
                </span>
              </div>
              <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
              <p className="text-base text-muted-foreground line-clamp-2">
                {tagline}
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={Math.min(progress, 100)} className="h-1" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {Math.round(progress)}% funded
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(depositAmount)} deposit
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
