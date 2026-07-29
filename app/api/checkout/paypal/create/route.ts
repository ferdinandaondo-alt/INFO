import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createPaypalOrder } from '@/lib/paypal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const product = await prisma.product.findUnique({ where: { slug: 'flagship' } });
    if (!product || !product.active) {
      return NextResponse.json({ error: 'Product unavailable' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const amountUSD = (product.priceCents / 100).toFixed(2);

    const order = await prisma.order.create({
      data: {
        userId: (session?.user as any)?.id,
        productId: product.id,
        amountCents: product.priceCents,
        currency: product.currency,
        method: 'PAYPAL',
        status: 'PENDING',
        customerEmail: email,
      },
    });

    const paypalOrder = await createPaypalOrder(amountUSD, order.orderNumber);

    await prisma.order.update({
      where: { id: order.id },
      data: { paypalOrderId: paypalOrder.id },
    });

    return NextResponse.json({ paypalOrderId: paypalOrder.id, orderId: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not start PayPal checkout' }, { status: 500 });
  }
}
