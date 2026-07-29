import { Reveal } from './Reveal';

const FEATURES = [
  {
    label: 'A',
    title: 'Single source of truth',
    body: 'Every claim cross-referenced, every figure sourced. No scattered tabs, no half-answers.',
  },
  {
    label: 'B',
    title: 'Instant delivery',
    body: 'Payment confirms, the file unlocks. No queues, no waiting on an inbox.',
  },
  {
    label: 'C',
    title: 'Own it outright',
    body: 'One payment, yours permanently. Re-download anytime from your dashboard.',
  },
  {
    label: 'D',
    title: 'Built for how you read',
    body: 'Structured with a real table of contents, not a wall of text — skim or study in depth.',
  },
];

export function Features() {
  return (
    <section className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow">Why this report</p>
          <h2 className="mt-3 max-w-xl font-display font-bold text-4xl text-paper md:text-5xl">
            Built like a document you can trust.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="bg-surface p-8">
              <span className="font-mono text-xs text-matrix">{f.label} /</span>
              <h3 className="mt-4 font-display font-bold text-xl text-paper">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
