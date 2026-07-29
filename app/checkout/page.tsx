'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PaypalButton } from '@/components/PaypalButton';
import { CryptoCheckout } from '@/components/CryptoCheckout';

type Method = 'paypal' | 'crypto';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState(session?.user?.email || '');
  const [method, setMethod] = useState<Method>('paypal');
  const [confirmed, setConfirmed] = useState<string | null>(null);

  if (confirmed) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center px-6 pt-24">
          <div className="doc-frame max-w-md rounded-sm p-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">Payment confirmed</p>
            <h1 className="mt-3 font-display font-bold text-3xl text-paper">Access granted</h1>
            <p className="mt-3 text-sm text-muted">
              Order <span className="text-paper">{confirmed}</span> is complete. A download link has been sent to{' '}
              {email}.
            </p>
            <button onClick={() => router.push('/dashboard')} className="btn-primary mt-8 w-full">
              Go to dashboard →
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-32">
        <div className="mx-auto max-w-xl px-6 pb-28">
          <p className="eyebrow text-center">Secure checkout</p>
          <h1 className="mt-3 text-center font-display font-bold text-4xl text-paper">The Global Scam Economy</h1>
          <p className="mt-2 text-center font-mono text-sm text-muted">$49.00 USD · one-time payment</p>

          <div className="doc-frame mt-10 rounded-sm p-7">
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Email for delivery
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
            />

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setMethod('paypal')}
                className={`flex-1 rounded-sm border px-4 py-3 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors ${
                  method === 'paypal' ? 'border-matrix bg-matrix/10 text-matrix' : 'border-border text-muted hover:border-matrix/40'
                }`}
              >
                Card / PayPal
              </button>
              <button
                onClick={() => setMethod('crypto')}
                className={`flex-1 rounded-sm border px-4 py-3 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors ${
                  method === 'crypto' ? 'border-matrix bg-matrix/10 text-matrix' : 'border-border text-muted hover:border-matrix/40'
                }`}
              >
                Crypto
              </button>
            </div>

            <div className="mt-6">
              {!email ? (
                <p className="rounded-sm border border-dashed border-border p-4 text-center text-xs text-muted">
                  Enter your email above to continue.
                </p>
              ) : method === 'paypal' ? (
                <PaypalButton email={email} onSuccess={setConfirmed} />
              ) : (
                <CryptoCheckout email={email} priceLabel="$49.00" />
              )}
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            🔒 Payments processed securely · card &amp; PayPal via PayPal Business
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
