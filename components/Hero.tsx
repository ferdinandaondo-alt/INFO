import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative flex min-h-[92vh] items-end">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="/hero-scam-economy.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
          <div className="absolute inset-0 bg-ink/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-40">
          <div className="eyebrow animate-rise opacity-0 mb-6 inline-flex items-center gap-2 rounded-full border border-matrix/30 bg-ink/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-matrix animate-blink" />
            REPORT // STATUS: AVAILABLE NOW
          </div>

          <h1
            className="glow-text animate-rise opacity-0 font-display text-4xl font-bold uppercase leading-[1.15] tracking-wide text-matrix sm:text-5xl md:text-6xl"
            style={{ animationDelay: '0.1s' }}
          >
            The Global
            <br />
            Scam Economy
          </h1>

          <p
            className="animate-rise opacity-0 mt-5 font-mono text-sm uppercase tracking-[0.15em] text-paper/90 sm:text-base"
            style={{ animationDelay: '0.25s' }}
          >
            Understanding fraud and its impact worldwide
          </p>

          <p
            className="animate-rise opacity-0 mt-6 max-w-xl text-balance text-base leading-relaxed text-muted"
            style={{ animationDelay: '0.32s' }}
          >
            A single, plain-language report on how modern scam networks actually operate — who they target,
            how the money moves, and what stops them. No subscription. One download, yours to keep.
          </p>

          <div
            className="animate-rise opacity-0 mt-10 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: '0.42s' }}
          >
            <Link href="/product" className="btn-primary">
              Get the report →
            </Link>
            <Link href="/#pricing" className="btn-secondary">
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
