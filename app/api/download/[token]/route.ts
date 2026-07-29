import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Invalid or expired download link' }, { status: 404 });
  }

  if (order.status !== 'PAID') {
    return NextResponse.json({ error: 'This order has not been confirmed yet' }, { status: 403 });
  }

  if (!order.product.pdfFileKey) {
    return NextResponse.json({ error: 'File not yet available — contact support' }, { status: 404 });
  }

  // Log the download for analytics before streaming the file.
  await prisma.$transaction([
    prisma.download.create({
      data: {
        orderId: order.id,
        ip: req.headers.get('x-forwarded-for') ?? undefined,
        userAgent: req.headers.get('user-agent') ?? undefined,
      },
    }),
    prisma.order.update({ where: { id: order.id }, data: { downloadCount: { increment: 1 } } }),
  ]);

  // Files are stored under /storage/products (outside the public dir so they
  // can't be accessed without a valid signed token).
  const filePath = path.join(process.cwd(), 'storage', 'products', order.product.pdfFileKey);

  try {
    const file = await readFile(filePath);
    return new NextResponse(file as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${order.product.pdfFileName || 'The-Global-Scam-Economy.pdf'}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found on server' }, { status: 500 });
  }
}
