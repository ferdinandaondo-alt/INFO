import { prisma } from '@/lib/prisma';

export default async function AdminOverviewPage() {
  const orders = await prisma.order.findMany({ select: { status: true, amountCents: true, downloadCount: true } });

  const revenueCents = orders.filter((o) => o.status === 'PAID').reduce((sum, o) => sum + o.amountCents, 0);
  const pendingReview = orders.filter((o) => o.status === 'AWAITING_REVIEW').length;
  const totalDownloads = orders.reduce((s, o) => s + o.downloadCount, 0);

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
      <StatCard label="Revenue" value={`$${(revenueCents / 100).toFixed(2)}`} />
      <StatCard label="Orders" value={String(orders.length)} />
      <StatCard label="Awaiting review" value={String(pendingReview)} accent />
      <StatCard label="Downloads" value={String(totalDownloads)} />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="doc-frame rounded-sm p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</p>
      <p className={`mt-2 font-display font-bold text-3xl ${accent ? 'text-matrix' : 'text-paper'}`}>{value}</p>
    </div>
  );
}
