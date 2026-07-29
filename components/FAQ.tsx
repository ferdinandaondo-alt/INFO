import { Reveal } from './Reveal';

const FAQS = [
  { q: 'What exactly am I buying?', a: 'A single PDF report — The Global Scam Economy. One payment, permanent access, no subscription.' },
  { q: 'How fast is delivery?', a: 'Instant for PayPal and card payments. Crypto payments unlock as soon as the transaction is confirmed on-chain, typically within minutes.' },
  { q: 'Which payment methods do you accept?', a: 'Credit and debit cards, PayPal, and crypto (Bitcoin, Ethereum, Solana, and USDT on TRC20 or ERC20).' },
  { q: 'Can I re-download later?', a: 'Yes. Every purchase is tied to your account dashboard, where you can re-download at any time.' },
  { q: 'Do you offer refunds?', a: 'Yes, within 7 days of purchase if the document hasn\u2019t been downloaded. See our Refund Policy for details.' },
  { q: 'Is my payment secure?', a: 'All card and PayPal payments are processed through PayPal\u2019s secure checkout. Crypto payments are verified on-chain before access is granted.' },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="eyebrow">Debrief</p>
          <h2 className="mt-3 font-display font-bold text-4xl text-paper md:text-5xl">Frequently asked.</h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 divide-y divide-border border-y border-border">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group py-1" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 marker:content-none">
                <span className="font-display text-lg text-paper">{f.q}</span>
                <span className="font-mono text-lg text-matrix transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-6 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
