'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/ShareButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, daysUntil } from '@/lib/utils';
import { COPY } from '@/contracts';

interface DepositWidgetProps {
  projectId: string;
  depositAmount: number;
  currentReservations: number;
  thresholdValue: number;
  deadlineAt: Date | string;
  priceTarget: number;
  status: string;
}

export function DepositWidget({
  projectId,
  depositAmount,
  currentReservations,
  thresholdValue,
  deadlineAt,
  priceTarget,
  status,
}: DepositWidgetProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const progress = (currentReservations / thresholdValue) * 100;
  const daysLeft = daysUntil(deadlineAt);
  const totalAmount = depositAmount * quantity;

  const isLive = status === 'LIVE';

  const handleReserve = async () => {
    setLoading(true);
    try {
      // TODO: Implement Stripe payment flow
      const response = await fetch(`/api/projects/${projectId}/pledges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (response.ok) {
        const { clientSecret } = await response.json();
        // Redirect to Stripe checkout or Elements
        console.log('Payment intent created:', clientSecret);
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Reserve Now</CardTitle>
            <CardDescription className="mt-2">
              {formatCurrency(depositAmount)} refundable deposit
            </CardDescription>
          </div>
          {isLive && (
            <Badge variant="default" className="bg-green-600">
              Live
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Progress value={Math.min(progress, 100)} />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {currentReservations} / {thresholdValue} reserved
            </span>
            <span className="text-muted-foreground">{daysLeft}d left</span>
          </div>
        </div>

        {isLive && (
          <>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Deposit amount</span>
                <span className="font-semibold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Est. product price</span>
                <span className="text-sm">{formatCurrency(priceTarget)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleReserve}
              disabled={loading || !isLive}
            >
              {loading ? 'Processing...' : 'Reserve with deposit'}
            </Button>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium text-center">Love this product?</p>
              <ShareButton projectId={projectId} variant="outline" className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                Share with friends to help reach the funding goal!
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              {COPY.depositExplainer}
            </p>
          </>
        )}

        {!isLive && status === 'REVIEW' && (
          <div className="text-center py-4">
            <Badge variant="outline">Under Review</Badge>
            <p className="text-sm text-muted-foreground mt-2">
              This project is being reviewed by our team.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
