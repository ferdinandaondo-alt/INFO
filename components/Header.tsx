'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Logo } from './Logo';
import { SignOutButton } from './SignOutButton';

const NAV_LINKS = [
  { href: '/product', label: 'Product' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-ink/90 backdrop-blur-md">
      {/* Checkbox drives the mobile menu open/closed state purely in CSS — no JS needed for the menu itself. */}
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 font-mono text-[12px] uppercase tracking-[0.15em] text-muted md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-paper">
              {l.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/dashboard" className="transition-colors hover:text-paper">Dashboard</Link>
              {isAdmin && (
                <Link href="/admin" className="transition-colors hover:text-matrix">Admin</Link>
              )}
              <SignOutButton className="transition-colors hover:text-paper" />
            </>
          ) : (
            <Link href="/login" className="transition-colors hover:text-paper">Sign in</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/product" className="btn-primary hidden !py-2.5 !px-5 text-[11px] sm:inline-flex md:!py-3.5 md:!px-7 md:text-[13px]">
            Get access
          </Link>

          {/* Mobile menu toggle (label, no JS) */}
          <label
            htmlFor="menu-toggle"
            aria-label="Toggle menu"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-border text-paper md:hidden"
          >
            <span className="relative flex h-3.5 w-4 flex-col justify-between">
              <span className="menu-line-top h-[1.5px] w-full bg-current transition-transform" />
              <span className="menu-line-mid h-[1.5px] w-full bg-current transition-opacity" />
              <span className="menu-line-bottom h-[1.5px] w-full bg-current transition-transform" />
            </span>
          </label>
        </div>
      </div>

      {/* Mobile menu panel - shown when the checkbox above is checked */}
      <nav className="hidden max-h-0 overflow-hidden border-t border-border bg-ink px-6 font-mono text-sm uppercase tracking-[0.1em] transition-all peer-checked:block peer-checked:max-h-[500px] peer-checked:py-6 md:hidden">
        <ul className="flex flex-col divide-y divide-border">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block py-4 text-paper">
                {l.label}
              </Link>
            </li>
          ))}
          {session ? (
            <>
              <li>
                <Link href="/dashboard" className="block py-4 text-paper">
                  Dashboard
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link href="/admin" className="block py-4 text-matrix">
                    Admin
                  </Link>
                </li>
              )}
              <li className="py-4">
                <SignOutButton className="text-left text-paper" />
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="block py-4 text-paper">
                Sign in
              </Link>
            </li>
          )}
        </ul>
        <Link href="/product" className="btn-primary mt-4 w-full">
          Get access
        </Link>
      </nav>
    </header>
  );
}
