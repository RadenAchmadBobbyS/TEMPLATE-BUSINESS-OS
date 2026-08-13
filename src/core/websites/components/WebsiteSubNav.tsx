'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils';
import {
  FileText,
  Compass,
  Palette,
  Database,
  Globe,
  Rocket,
  BarChart3,
  FormInput,
  Settings,
  ArrowLeftRight,
} from 'lucide-react';

const navItems = [
  { label: 'Pages', href: 'pages', icon: FileText },
  { label: 'Navigation', href: 'navigation', icon: Compass },
  { label: 'Theme', href: 'theme', icon: Palette },
  { label: 'CMS', href: 'cms', icon: Database },
  { label: 'Forms', href: 'forms', icon: FormInput },
  { label: 'Domains', href: 'domains', icon: Globe },
  { label: 'Deploy', href: 'deploy', icon: Rocket },
  { label: 'Analytics', href: 'analytics', icon: BarChart3 },
  { label: 'Redirects', href: 'redirects', icon: ArrowLeftRight },
  { label: 'Settings', href: 'settings', icon: Settings },
];

export function WebsiteSubNav({ websiteId }: { websiteId: string }) {
  const pathname = usePathname();
  const basePath = `/dashboard/websites/${websiteId}`;

  return (
    <div className="bg-background overflow-x-auto border-b">
      <nav className="flex gap-0.5 px-4 md:px-8" aria-label="Website sections">
        {navItems.map((item) => {
          const fullHref = `${basePath}/${item.href}`;
          const isActive = pathname.includes(`/${websiteId}/${item.href}`);

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                'inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 border-transparent',
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
