'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

type Wallet = {
  currency: 'BTC' | 'ETH' | 'SOL' | 'USDT_TRC20' | 'USDT_ERC20';
  network: string;
  address: string;
};

const LABELS: Record<Wallet['currency'], string> = {
  BTC: 'Bitcoin (BTC)',
  ETH: 'Ethereum (ETH)',
  SOL: 'Solana (SOL)',
  USDT_TRC20: 'USDT — TRC20',
  USDT_ERC20: 'USDT — ERC20',
};

export function CryptoCheckout({ email, priceLabel }: { email: string; priceLabel: string }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selected, setSelected] = useState<Wallet | null>(null);
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/checkout/crypto')
      .then((r) => r.json())
      .then((d) => {
        setWallets(d.wallets || []);
        if (d.wallets?.length) setSelected(d.wallets[0]);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currency: selected.currency, txHash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(data.orderNumber);
      toast.success('Payment submitted for review');
    } catch (err: any) {
      toast.error(err.message || 'Could not submit payment');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-sm border border-signal/40 bg-signal/5 p-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">Submitted for review</p>
        <p className="mt-2 text-sm text-muted">
          Order <span className="text-paper">{submitted}</span> is awaiting on-chain confirmation. You&apos;ll
          receive your download link by email — usually within minutes.
        </p>
      </div>
    );
  }

  if (!wallets.length) {
    return (
      <div className="rounded-sm border border-dashed border-border p-4 text-center text-xs text-muted">
        No crypto wallets are configured yet. Add receiving addresses from the Admin Dashboard →
        Payment Settings.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {wallets.map((w) => (
          <button
            key={w.currency}
            onClick={() => setSelected(w)}
            className={`rounded-sm border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              selected?.currency === w.currency
                ? 'border-matrix bg-matrix/10 text-matrix'
                : 'border-border text-muted hover:border-matrix/40'
            }`}
          >
            {LABELS[w.currency]}
          </button>
        ))}
      </div>

      {selected && (
        <div className="doc-frame rounded-sm p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="rounded-sm bg-white p-3">
              <QRCodeSVG value={selected.address} size={128} />
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Network</p>
                <p className="text-sm text-paper">{selected.network}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Send exactly</p>
                <p className="text-sm text-paper">{priceLabel} equivalent</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Address</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selected.address);
                    toast.success('Address copied');
                  }}
                  className="break-all text-left font-mono text-xs text-matrix hover:underline"
                >
                  {selected.address}
                </button>
              </div>
            </div>
          </div>

          <ol className="mt-6 space-y-1.5 font-mono text-[11px] text-muted">
            <li>1. Send the exact amount to the address above on the {selected.network} network only.</li>
            <li>2. Copy your transaction hash / signature once sent.</li>
            <li>3. Submit it below — we&apos;ll verify on-chain and unlock your download.</li>
          </ol>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              required
              placeholder="Transaction hash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono text-xs text-paper outline-none focus:border-matrix"
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? 'Submitting…' : 'I\u2019ve sent payment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
