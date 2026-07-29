import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

// Uploads go to /storage/products (private, not web-served) and the file is
// referenced by key on the Product row — so swapping the PDF never requires
// touching the product page's code or copy.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
  }

  const dir = path.join(process.cwd(), 'storage', 'products');
  await mkdir(dir, { recursive: true });

  const fileKey = `${uuid()}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileKey), buffer);

  const product = await prisma.product.update({
    where: { slug: 'flagship' },
    data: { pdfFileKey: fileKey, pdfFileName: file.name },
  });

  return NextResponse.json({ success: true, product });
}
