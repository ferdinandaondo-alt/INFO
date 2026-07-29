'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/settings', label: 'Payment settings' },
  { href: '/admin/pdf', label: 'PDF manager' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
      {LINKS.map((l) => {
        const active = l.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-sm px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              active ? 'bg-matrix/10 text-matrix' : 'text-muted hover:text-paper'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
