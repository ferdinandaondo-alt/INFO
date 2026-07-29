import Link from 'next/link';
import { Reveal } from './Reveal';

const INCLUDED = [
  'The complete report (212 pages)',
  'Lifetime access + re-downloads',
  'Quarterly content updates',
  'PayPal, card, or crypto checkout',
  'Instant delivery on confirmation',
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border py-28">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <p className="eyebrow">Access</p>
          <h2 className="mt-3 font-display font-bold text-4xl text-paper md:text-5xl">One price. Own it forever.</h2>
        </Reveal>

        <Reveal delay={0.1} className="doc-frame mt-12 rounded-sm p-10 text-left md:p-14">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Full Report Access</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">One-time</span>
          </div>
          <p className="mt-6 font-display font-bold text-6xl text-paper">
            $49<span className="ml-1 text-lg text-muted">USD</span>
          </p>
          <ul className="mt-8 space-y-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-1 text-matrix">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/checkout" className="btn-primary mt-10 w-full">
            Proceed to checkout →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
