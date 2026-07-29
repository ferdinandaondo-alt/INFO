import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Default product
  await prisma.product.upsert({
    where: { slug: 'flagship' },
    update: {},
    create: {
      slug: 'flagship',
      name: 'The Global Scam Economy',
      tagline: 'Understanding fraud and its impact worldwide',
      description:
        'A single, plain-language report on how modern scam networks actually operate — who they target, how the money moves through the system, and what actually stops them.',
      priceCents: 4900,
      currency: 'USD',
      benefits: [
        'Understand how scam networks are actually organized',
        'See how stolen funds move and where they end up',
        'Spot the tactics before you or someone you know is targeted',
        'Cross-referenced sourcing you can verify yourself',
      ],
      included: [
        '212-page primary report (PDF)',
        'Executive summary (12 pages)',
        'Full source index and citations',
        'Lifetime access with re-download rights',
      ],
      active: true,
    },
  });

  // Admin account — CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN.
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change-me-immediately';
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashed,
      role: 'ADMIN',
    },
  });

  console.log(`Seeded product and admin account: ${adminEmail} / ${adminPassword}`);
  console.log('Change this password immediately after first login.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
