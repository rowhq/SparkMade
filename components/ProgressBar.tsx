import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  target,
  label,
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <Progress value={percentage} />
    </div>
  );
}
