import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PillProps extends BadgeProps {
  children: React.ReactNode;
}

export function Pill({ children, className, ...props }: PillProps) {
  return (
    <Badge
      variant="outline"
      className={cn('rounded-full px-3 py-1', className)}
      {...props}
    >
      {children}
    </Badge>
  );
}
