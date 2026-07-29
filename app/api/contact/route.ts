import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    await prisma.contactMessage.create({ data });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Could not send message' }, { status: 400 });
  }
}
