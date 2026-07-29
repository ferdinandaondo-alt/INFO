import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { capturePaypalOrder } from '@/lib/paypal';
import { generateDownloadToken } from '@/lib/tokens';
import { sendPurchaseConfirmation, sendReceipt, sendDownloadLink } from '@/lib/email';

const schema = z.object({ paypalOrderId: z.string() });

export async function POST(req: NextRequest) {
  try {
    const { paypalOrderId } = schema.parse(await req.json());

    const order = await prisma.order.findFirst({ where: { paypalOrderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const capture = await capturePaypalOrder(paypalOrderId);
    const captureId = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const status = capture?.status;

    if (status !== 'COMPLETED') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'FAILED' } });
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    const downloadToken = generateDownloadToken();
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paypalCaptureId: captureId,
        downloadToken,
      },
    });

    const amountFormatted = `$${(updated.amountCents / 100).toFixed(2)} ${updated.currency}`;
    const downloadUrl = `${process.env.NEXTAUTH_URL}/api/download/${downloadToken}`;

    await Promise.all([
      sendPurchaseConfirmation(updated.customerEmail, updated.orderNumber, amountFormatted),
      sendReceipt(updated.customerEmail, updated.orderNumber, amountFormatted, 'PayPal'),
      sendDownloadLink(updated.customerEmail, downloadUrl),
    ]);

    return NextResponse.json({ success: true, orderNumber: updated.orderNumber, downloadToken });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 });
  }
}
