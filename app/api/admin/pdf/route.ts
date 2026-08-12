import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

// Uploads go to Vercel Blob storage instead of local disk. Vercel's
// serverless functions have a read-only filesystem — fs.writeFile() has
// nowhere to actually save a file — so object storage is required, not
// optional, once you're deployed there. The Product row stores the blob's
// URL directly, so swapping the PDF never requires touching the product
// page's code or copy.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
  }

  // Look up the existing file so we can delete it after a successful
  // replacement — otherwise old PDFs pile up in the Blob store forever.
  const existing = await prisma.product.findUnique({ where: { slug: 'flagship' } });

  // addRandomSuffix keeps the blob URL unguessable even though the store is
  // public — this preserves the same "don't expose the download until
  // payment is confirmed" gating used by the /api/download/[token] route.
  const blob = await put(`products/${crypto.randomUUID()}.pdf`, file, {
    access: 'public',
    contentType: 'application/pdf',
  });

  const product = await prisma.product.update({
    where: { slug: 'flagship' },
    data: { pdfFileKey: blob.url, pdfFileName: file.name },
  });

  if (existing?.pdfFileKey) {
    try {
      await del(existing.pdfFileKey);
    } catch {
      // Non-fatal — old file just gets orphaned in storage rather than
      // blocking the upload of the new one.
    }
  }

  return NextResponse.json({ success: true, product });
}
