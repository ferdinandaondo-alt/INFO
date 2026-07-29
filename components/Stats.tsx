import { Reveal } from './Reveal';

const STATS = [
  { value: '212', unit: 'pages', desc: 'of structured research' },
  { value: '4,180', unit: 'copies', desc: 'in active circulation' },
  { value: '<10s', unit: 'delivery', desc: 'from payment to download' },
  { value: '4.9', unit: '/ 5', desc: 'average buyer rating' },
];

export function Stats() {
  return (
    <section className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.desc} delay={i * 0.08}>
              <p className="font-display font-bold text-4xl text-matrix md:text-5xl">
                {s.value}
                <span className="ml-1 font-mono text-sm text-muted">{s.unit}</span>
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
