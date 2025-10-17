import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && <div className="mb-4 text-6xl opacity-50">{icon}</div>}
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-base max-w-md mb-6">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button>{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
