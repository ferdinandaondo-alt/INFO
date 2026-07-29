import { prisma } from '@/lib/prisma';
import { WalletRow } from '@/components/WalletRow';

const CURRENCIES = ['BTC', 'ETH', 'SOL', 'USDT_TRC20', 'USDT_ERC20'] as const;

export default async function AdminSettingsPage() {
  const wallets = await prisma.cryptoWallet.findMany();
  const byCurrency = Object.fromEntries(wallets.map((w) => [w.currency, w]));

  return (
    <div className="space-y-6">
      <div className="doc-frame rounded-sm p-6">
        <p className="eyebrow mb-3">PayPal Business</p>
        <p className="text-sm text-muted">
          Configured via environment variables: <code className="text-matrix">PAYPAL_CLIENT_ID</code>,{' '}
          <code className="text-matrix">PAYPAL_CLIENT_SECRET</code>, and{' '}
          <code className="text-matrix">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>. Card payments run through the same
          PayPal integration.
        </p>
      </div>

      <div className="doc-frame rounded-sm p-6">
        <p className="eyebrow mb-4">Crypto receiving wallets</p>
        <div className="space-y-4">
          {CURRENCIES.map((c) => (
            <WalletRow
              key={c}
              currency={c}
              initialNetwork={(byCurrency as any)[c]?.network || ''}
              initialAddress={(byCurrency as any)[c]?.address || ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
