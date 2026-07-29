import { Reveal } from './Reveal';

const QUOTES = [
  { quote: 'I read a lot in this space. This is the one document I keep coming back to.', name: 'M. Okafor', role: 'Analyst' },
  { quote: 'Paid once, referenced it for months. Worth far more than it cost.', name: 'S. Delacroix', role: 'Founder' },
  { quote: 'Dense but never bloated. Every section earns its place.', name: 'J. Whitfield', role: 'Researcher' },
];

export function Testimonials() {
  return (
    <section className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow">Field reports</p>
          <h2 className="mt-3 max-w-xl font-display font-bold text-4xl text-paper md:text-5xl">What readers say.</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {QUOTES.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="doc-frame rounded-sm p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-matrix/70">Testimony 0{i + 1}</p>
              <p className="mt-4 text-lg leading-relaxed text-paper">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                {t.name} · {t.role}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
