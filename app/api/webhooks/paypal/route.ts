import { NextRequest, NextResponse } from 'next/server';
import { verifyPaypalWebhook } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';

// Configure this URL in your PayPal Developer Dashboard → Webhooks.
// Handles cases like delayed captures, disputes, or refunds initiated in PayPal directly.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const verified = await verifyPaypalWebhook(req.headers, body);

  if (!verified) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const eventType = body.event_type;
  const paypalOrderId =
    body.resource?.supplementary_data?.related_ids?.order_id || body.resource?.id;

  if (!paypalOrderId) return NextResponse.json({ received: true });

  const order = await prisma.order.findFirst({ where: { paypalOrderId } });
  if (!order) return NextResponse.json({ received: true });

  switch (eventType) {
    case 'PAYMENT.CAPTURE.REFUNDED':
      await prisma.order.update({ where: { id: order.id }, data: { status: 'REFUNDED' } });
      break;
    case 'PAYMENT.CAPTURE.DENIED':
      await prisma.order.update({ where: { id: order.id }, data: { status: 'FAILED' } });
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
