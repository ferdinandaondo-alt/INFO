import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const wallets = await prisma.cryptoWallet.findMany();
  return NextResponse.json({ wallets });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { currency, network, address, active } = await req.json();

  const wallet = await prisma.cryptoWallet.upsert({
    where: { currency },
    update: { network, address, active },
    create: { currency, network, address, active: active ?? true },
  });

  return NextResponse.json({ wallet });
}
