import { prisma } from '@/lib/prisma';

export default async function AdminCustomersPage() {
  const orders = await prisma.order.findMany({ select: { customerEmail: true } });
  const customers = Array.from(new Set(orders.map((o) => o.customerEmail))).sort();

  return (
    <div className="divide-y divide-border border-y border-border">
      {customers.map((c) => (
        <div key={c} className="py-3 text-sm text-paper">
          {c}
        </div>
      ))}
      {customers.length === 0 && <p className="py-6 text-sm text-muted">No customers yet.</p>}
    </div>
  );
}
