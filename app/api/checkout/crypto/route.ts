import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  currency: z.enum(['BTC', 'ETH', 'SOL', 'USDT_TRC20', 'USDT_ERC20']),
  txHash: z.string().min(6, 'Enter a valid transaction hash'),
});

// Step 1: buyer requests the receiving wallet address + a pending order is opened.
export async function GET() {
  const wallets = await prisma.cryptoWallet.findMany({ where: { active: true } });
  return NextResponse.json({ wallets });
}

// Step 2: buyer submits proof of payment (tx hash). Order goes to AWAITING_REVIEW
// until an admin confirms the on-chain transaction and approves the download.
export async function POST(req: NextRequest) {
  try {
    const { email, currency, txHash } = schema.parse(await req.json());

    const product = await prisma.product.findUnique({ where: { slug: 'flagship' } });
    if (!product) return NextResponse.json({ error: 'Product unavailable' }, { status: 400 });

    const wallet = await prisma.cryptoWallet.findUnique({ where: { currency } });
    if (!wallet || !wallet.active) {
      return NextResponse.json({ error: 'This currency is not currently accepted' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    const order = await prisma.order.create({
      data: {
        userId: (session?.user as any)?.id,
        productId: product.id,
        amountCents: product.priceCents,
        currency: product.currency,
        method: 'CRYPTO',
        status: 'AWAITING_REVIEW',
        customerEmail: email,
        cryptoCurrency: currency,
        cryptoTxHash: txHash,
        cryptoWalletId: wallet.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      message: 'Payment submitted. We\u2019ll verify the transaction and unlock your download shortly.',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not submit payment' }, { status: 500 });
  }
}
