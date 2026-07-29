import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendPasswordReset } from '@/lib/email';
import { randomBytes } from 'crypto';

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const { email } = schema.parse(await req.json());
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Always return success — don't leak whether an email is registered.
  if (!user) return NextResponse.json({ success: true });

  const token = randomBytes(32).toString('hex');
  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
  await sendPasswordReset(user.email, resetUrl);

  return NextResponse.json({ success: true });
}
