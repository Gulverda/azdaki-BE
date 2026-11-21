import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ABOUT_CONTENT } from './about-content';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 10) },
  });

  await prisma.aboutPage.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...ABOUT_CONTENT },
  });

  console.log(`Seeded admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
