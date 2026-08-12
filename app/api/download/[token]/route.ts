import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';
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

  // pdfFileKey holds the blob's pathname. Private blobs can't be fetched by
  // URL directly — get() authenticates the request using the store's
  // credentials (via BLOB_READ_WRITE_TOKEN / OIDC) and returns a stream,
  // which we pipe straight through to the buyer without ever exposing the
  // underlying storage location.
  const result = await get(order.product.pdfFileKey, { access: 'private' });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: 'File not found in storage' }, { status: 500 });
  }

  return new NextResponse(result.stream as any, {
    headers: {
      'Content-Type': result.blob?.contentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${order.product.pdfFileName || 'The-Global-Scam-Economy.pdf'}"`,
    },
  });
}
