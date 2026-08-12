import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

  // pdfFileKey now holds the full Vercel Blob URL. We fetch it server-side
  // and stream it back through our own route rather than redirecting the
  // browser there directly — this keeps the actual blob URL out of the
  // buyer's address bar and network tab, preserving the same "never expose
  // the raw storage location" behavior the local-disk version had.
  const blobRes = await fetch(order.product.pdfFileKey);
  if (!blobRes.ok || !blobRes.body) {
    return NextResponse.json({ error: 'File not found in storage' }, { status: 500 });
  }

  return new NextResponse(blobRes.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${order.product.pdfFileName || 'The-Global-Scam-Economy.pdf'}"`,
    },
  });
}
