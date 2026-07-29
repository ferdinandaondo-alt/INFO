import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-[220px] text-sm text-muted">
              Premium Digital Intelligence, delivered instantly.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Product</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/product" className="hover:text-paper">Overview</Link></li>
              <li><Link href="/#pricing" className="hover:text-paper">Pricing</Link></li>
              <li><Link href="/#faq" className="hover:text-paper">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/legal/privacy" className="hover:text-paper">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-paper">Terms of Service</Link></li>
              <li><Link href="/legal/refunds" className="hover:text-paper">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Contact</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/contact" className="hover:text-paper">Support</Link></li>
              <li className="flex gap-4 pt-1">
                <a href="#" aria-label="X" className="hover:text-matrix">X</a>
                <a href="#" aria-label="LinkedIn" className="hover:text-matrix">in</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} INFO. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-blink" />
            Systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
