import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

// Uploads go to Vercel Blob storage using PRIVATE access — your store was
// created as private (Vercel's dashboard now defaults to this), and a
// store's access mode is fixed at creation time, so this must match. Private
// blobs can only be read back through server code (see the download route),
// never via a guessable public URL — a real security improvement over the
// public-blob version, and it fits the existing design since we were
// already proxying downloads through our own route rather than exposing the
// raw storage URL to buyers.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug: 'flagship' } });

  const pathname = `products/${crypto.randomUUID()}.pdf`;
  const blob = await put(pathname, file, {
    access: 'private',
    contentType: 'application/pdf',
  });

  // Store the pathname (not the URL) — private blobs are retrieved by
  // pathname through the SDK's get(), not by fetching a URL directly.
  const product = await prisma.product.update({
    where: { slug: 'flagship' },
    data: { pdfFileKey: blob.pathname, pdfFileName: file.name },
  });

  if (existing?.pdfFileKey) {
    try {
      await del(existing.pdfFileKey);
    } catch {
      // Non-fatal — old file is just orphaned in storage rather than
      // blocking the upload of the new one.
    }
  }

  return NextResponse.json({ success: true, product });
}
