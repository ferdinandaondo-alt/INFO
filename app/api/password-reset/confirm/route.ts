import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  email: z.string().email(),
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = schema.parse(await req.json());

    const record = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email.toLowerCase(), token } },
    });

    if (!record || record.expires < new Date()) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { email: email.toLowerCase() }, data: { password: hashed } });
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email.toLowerCase(), token } },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not reset password' }, { status: 500 });
  }
}
