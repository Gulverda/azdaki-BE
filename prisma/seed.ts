import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
    create: {
      titleKa: 'ჩვენს შესახებ',
      titleEn: 'About us',
      contentKa: '<p>თეატრის შესახებ ტექსტი</p>',
      contentEn: '<p>About the theatre</p>',
    },
  });

  console.log(`Seeded admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
