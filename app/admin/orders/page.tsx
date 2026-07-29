import { prisma } from '@/lib/prisma';
import { OrderActions } from '@/components/OrderActions';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
            <th className="pb-3 pr-4">Order</th>
            <th className="pb-3 pr-4">Customer</th>
            <th className="pb-3 pr-4">Amount</th>
            <th className="pb-3 pr-4">Method</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="py-3 pr-4 font-mono text-xs text-muted">{o.orderNumber}</td>
              <td className="py-3 pr-4 text-paper">{o.customerEmail}</td>
              <td className="py-3 pr-4 text-paper">
                ${(o.amountCents / 100).toFixed(2)} {o.currency}
              </td>
              <td className="py-3 pr-4 text-muted">
                {o.method}
                {o.cryptoCurrency ? ` · ${o.cryptoCurrency}` : ''}
              </td>
              <td className="py-3 pr-4">
                <span className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] uppercase text-muted">
                  {o.status.replace('_', ' ')}
                </span>
              </td>
              <td className="py-3 pr-4">
                <OrderActions orderId={o.id} status={o.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="py-8 text-center text-sm text-muted">No orders yet.</p>}
    </div>
  );
}
