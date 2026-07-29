import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' },
    include: { downloads: true },
  });

  return (
    <>
      <Header />
      <main className="pt-32">
        <div className="mx-auto max-w-4xl px-6 pb-28">
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-3 font-display font-bold text-4xl text-paper">Your account</h1>
          <p className="mt-2 text-sm text-muted">Signed in as {session.user?.email}</p>

          <div className="mt-12">
            <p className="eyebrow mb-4">Purchase history</p>
            {orders.length === 0 ? (
              <div className="doc-frame rounded-sm p-8 text-center text-sm text-muted">
                No purchases yet. <a href="/product" className="text-matrix hover:underline">Get the report →</a>
              </div>
            ) : (
              <div className="divide-y divide-border border-y border-border">
                {orders.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <div>
                      <p className="font-mono text-xs text-muted">{o.orderNumber}</p>
                      <p className="mt-1 text-sm text-paper">
                        ${(o.amountCents / 100).toFixed(2)} {o.currency} · {o.method}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-muted">
                        {new Date(o.createdAt).toLocaleDateString()} · {o.downloads.length} download
                        {o.downloads.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={o.status} />
                      {o.status === 'PAID' && o.downloadToken && (
                        <a
                          href={`/api/download/${o.downloadToken}`}
                          className="btn-secondary !py-2 !px-4 text-[11px]"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: 'text-signal border-signal/40 bg-signal/5',
    PENDING: 'text-muted border-border',
    AWAITING_REVIEW: 'text-matrix border-matrix/40 bg-matrix/5',
    FAILED: 'text-danger border-danger/40 bg-danger/5',
    REFUNDED: 'text-muted border-border',
  };
  return (
    <span className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
