import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  Product: [
    { label: 'Explore', href: '/explore' },
    { label: 'Studio', href: '/studio' },
    { label: 'How it works', href: '/how-it-works' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Resources: [
    { label: 'Support', href: '/support' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Guidelines', href: '/guidelines' },
  ],
  Legal: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/50 bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-semibold mb-4">SparkMade</h3>
            <p className="text-base text-muted-foreground">
              The product is the strategy.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-muted-foreground hover:text-foreground transition-apple"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SparkMade. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Bringing new products to life.
          </p>
        </div>
      </div>
    </footer>
  );
}
