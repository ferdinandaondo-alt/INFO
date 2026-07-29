import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { generateDownloadToken } from '@/lib/tokens';
import { sendPurchaseConfirmation, sendDownloadLink } from '@/lib/email';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { cryptoWallet: true },
    take: 200,
  });

  const revenueCents = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.amountCents, 0);

  return NextResponse.json({ orders, revenueCents, count: orders.length });
}

// Approve a crypto order after manually verifying the on-chain transaction,
// or issue a refund on any order.
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { orderId, action, note } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  if (action === 'approve') {
    const downloadToken = generateDownloadToken();
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID', downloadToken, adminNote: note },
    });
    const downloadUrl = `${process.env.NEXTAUTH_URL}/api/download/${downloadToken}`;
    const amountFormatted = `$${(updated.amountCents / 100).toFixed(2)} ${updated.currency}`;
    await sendPurchaseConfirmation(updated.customerEmail, updated.orderNumber, amountFormatted);
    await sendDownloadLink(updated.customerEmail, downloadUrl);
    return NextResponse.json({ success: true, order: updated });
  }

  if (action === 'refund') {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'REFUNDED', adminNote: note },
    });
    // Note: for PayPal orders this only updates internal status. To move the
    // money back, issue the refund from the PayPal dashboard or call
    // POST /v2/payments/captures/{capture_id}/refund with paypalCaptureId.
    return NextResponse.json({ success: true, order: updated });
  }

  if (action === 'reject') {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'FAILED', adminNote: note },
    });
    return NextResponse.json({ success: true, order: updated });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
