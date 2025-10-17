import { Nav } from './Nav';
import { Footer } from './Footer';

interface BrandShellProps {
  children: React.ReactNode;
  footer?: boolean;
}

export function BrandShell({ children, footer = true }: BrandShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      {footer && <Footer />}
    </div>
  );
}
