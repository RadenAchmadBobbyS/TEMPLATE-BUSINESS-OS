'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SettingsNav() {
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Workspace Settings', href: '/dashboard/settings/workspace' },
    { name: 'Personal Profile', href: '/dashboard/settings/profile' },
  ];

  return (
    <div className="flex gap-6 border-b-2 mb-6" style={{ borderColor: 'var(--line)' }}>
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className="font-data relative -mb-0.5 pb-3 text-xs font-semibold tracking-wider uppercase transition-colors"
            style={{
              color: isActive ? 'var(--ink)' : 'var(--slate)',
              borderBottom: isActive ? '2px solid var(--signal)' : '2px solid transparent',
            }}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
