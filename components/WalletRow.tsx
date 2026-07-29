'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function WalletRow({
  currency,
  initialNetwork,
  initialAddress,
}: {
  currency: string;
  initialNetwork: string;
  initialAddress: string;
}) {
  const [network, setNetwork] = useState(initialNetwork);
  const [address, setAddress] = useState(initialAddress);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch('/api/admin/wallets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency, network, address, active: true }),
    });
    setSaving(false);
    if (res.ok) toast.success(`${currency} wallet saved`);
    else toast.error('Could not save wallet');
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[100px_1fr_1fr_auto] sm:items-center">
      <span className="font-mono text-xs text-muted">{currency}</span>
      <input
        placeholder="Network (e.g. TRC20)"
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        className="rounded-sm border border-border bg-surface px-3 py-2 text-xs text-paper outline-none focus:border-matrix"
      />
      <input
        placeholder="Wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="rounded-sm border border-border bg-surface px-3 py-2 font-mono text-xs text-paper outline-none focus:border-matrix"
      />
      <button onClick={save} disabled={saving} className="btn-secondary !py-2 !px-4 text-[10px] disabled:opacity-50">
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
