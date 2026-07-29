import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { prisma } from '@/lib/prisma';

async function getProduct() {
  try {
    const product = await prisma.product.findUnique({ where: { slug: 'flagship' } });
    if (product) return product;
  } catch {
    // DB not configured yet — fall through to static defaults so the page still renders.
  }
  return {
    name: 'The Global Scam Economy',
    tagline: 'Understanding fraud and its impact worldwide',
    description:
      'A single, plain-language report on how modern scam networks actually operate — who they target, how the money moves through the system, and what actually stops them. Built for people who want the real picture, not headlines.',
    priceCents: 4900,
    currency: 'USD',
    benefits: [
      'Understand how scam networks are actually organized',
      'See how stolen funds move and where they end up',
      'Spot the tactics before you or someone you know is targeted',
      'Cross-referenced sourcing you can verify yourself',
    ],
    included: [
      '212-page primary report (PDF)',
      'Executive summary (12 pages)',
      'Full source index and citations',
      'Lifetime access with re-download rights',
    ],
  };
}

export default async function ProductPage() {
  const product = await getProduct();
  const price = (product.priceCents / 100).toFixed(2);

  return (
    <>
      <Header />
      <main className="pt-32">
        <div className="mx-auto max-w-6xl px-6 pb-28">
          <div className="grid gap-16 md:grid-cols-2 md:items-start">
            <Reveal>
              <div className="doc-frame sticky top-32 aspect-[3/4] overflow-hidden rounded-sm p-8">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    <span>SCAM_ECONOMY_REPORT.PDF</span>
                    <span className="text-signal">● Verified</span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-matrix/70">Document</p>
                    <h1 className="glow-text mt-3 font-display text-2xl font-bold uppercase tracking-wide text-matrix">{product.name}</h1>
                    <p className="mt-2 text-sm text-muted">{product.tagline}</p>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    212 pages · Updated quarterly
                  </div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="eyebrow">Product</p>
                <h2 className="mt-3 font-display font-bold text-4xl text-paper md:text-5xl">{product.name}</h2>
                <p className="mt-5 leading-relaxed text-muted">{product.description}</p>
              </Reveal>

              <Reveal delay={0.1} className="mt-10">
                <p className="eyebrow mb-4">What&apos;s included</p>
                <ul className="space-y-2.5">
                  {(product.included as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-paper/90">
                      <span className="mt-0.5 text-matrix">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.15} className="mt-10">
                <p className="eyebrow mb-4">Benefits</p>
                <ul className="space-y-2.5">
                  {(product.benefits as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-paper/90">
                      <span className="mt-0.5 text-signal">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.2} className="mt-10 rounded-sm border border-border bg-surface/60 p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-signal">⚡ Instant delivery</p>
                <p className="mt-2 text-sm text-muted">
                  Your download unlocks the moment payment is confirmed — automatically for card and PayPal, and
                  within minutes of on-chain confirmation for crypto.
                </p>
              </Reveal>

              <Reveal delay={0.25} className="mt-10 flex items-center justify-between border-t border-border pt-8">
                <div>
                  <p className="font-display font-bold text-4xl text-paper">
                    ${price} <span className="text-base text-muted">{product.currency}</span>
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">One-time payment</p>
                </div>
                <Link href="/checkout" className="btn-primary">
                  Secure checkout →
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
