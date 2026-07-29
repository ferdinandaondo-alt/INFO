'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import toast from 'react-hot-toast';

export function OrderActions({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function act(action: 'approve' | 'refund' | 'reject') {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action }),
    });
    if (res.ok) {
      toast.success(action === 'approve' ? 'Order approved' : action === 'refund' ? 'Order refunded' : 'Order rejected');
      startTransition(() => router.refresh());
    } else {
      toast.error('Action failed');
    }
  }

  if (status === 'AWAITING_REVIEW') {
    return (
      <div className="flex gap-3">
        <button onClick={() => act('approve')} disabled={pending} className="font-mono text-[11px] text-signal hover:underline disabled:opacity-50">
          Approve
        </button>
        <button onClick={() => act('reject')} disabled={pending} className="font-mono text-[11px] text-danger hover:underline disabled:opacity-50">
          Reject
        </button>
      </div>
    );
  }

  if (status === 'PAID') {
    return (
      <button onClick={() => act('refund')} disabled={pending} className="font-mono text-[11px] text-muted hover:underline disabled:opacity-50">
        Refund
      </button>
    );
  }

  return null;
}
