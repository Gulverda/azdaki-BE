import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { Pool } from 'pg';
import { PrismaService } from '../prisma/prisma.service';
import { buildResources } from './resources';
import { translations } from './translations';

/**
 * AdminJS-ის პაკეტები მხოლოდ ESM-ია, ჩვენი პროექტი კი CommonJS-ად აიწყობა. ამიტომ
 * მათ ვერ შემოვიტანთ ჩვეულებრივი `import`-ით და ვიყენებთ dynamic `import()`-ს.
 */
async function loadAdminJs() {
  const [{ default: AdminJS, ComponentLoader }, prismaAdapter] =
    await Promise.all([import('adminjs'), import('@adminjs/prisma')]);
  AdminJS.registerAdapter({
    Database: prismaAdapter.Database,
    Resource: prismaAdapter.Resource,
  });
  return { AdminJS, ComponentLoader };
}

/** AdminJS-ის კონფიგურაცია — იყენებს როგორც მოდული, ისე build-ის დროს bundle-admin.ts */
export async function buildAdminJsOptions(prisma: PrismaService) {
  const { ComponentLoader } = await loadAdminJs();
  const componentLoader = new ComponentLoader();
  return {
    rootPath: '/admin',
    componentLoader,
    resources: await buildResources(prisma, componentLoader),
    branding: {
      companyName: 'Azdaki — ადმინპანელი',
      logo: false as const,
      withMadeWithLove: false,
    },
    locale: {
      language: 'en',
      availableLanguages: ['en'],
      translations: { en: translations },
    },
  };
}

/** AdminJS ადმინპანელი: http://localhost:3000/admin */
export async function createAdminPanelModule(): Promise<DynamicModule> {
  const { AdminModule } = await import('@adminjs/nestjs');
  await loadAdminJs();

  // Nest-ის `imports` მასივი Promise<DynamicModule>-საც იღებს, ეს სწორედ ამისთვისაა.
  return AdminModule.createAdminAsync({
    inject: [PrismaService, ConfigService],
    useFactory: async (prisma: PrismaService, config: ConfigService) => {
      const secret = config.getOrThrow<string>('SESSION_SECRET');
      // session-ები Postgres-ში ("session" ცხრილი, იხ. schema.prisma): Vercel-ზე მეხსიერება
      // instance-ებს შორის არ ზიარდება და მეხსიერებაში შენახვისას ყოველ ჯერზე login-ზე გადაგვაგდებდა
      const PgStore = connectPgSimple(session);
      const store = new PgStore({
        pool: new Pool({
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
          max: 2,
        }),
      });
      return {
        adminJsOptions: await buildAdminJsOptions(prisma),
        auth: {
          authenticate: async (email: string, password: string) => {
            const admin = await prisma.admin.findUnique({ where: { email } });
            const valid =
              admin && (await bcrypt.compare(password, admin.passwordHash));
            return valid ? { email: admin.email } : null;
          },
          cookieName: 'azdaki-admin',
          cookiePassword: secret,
        },
        sessionOptions: {
          resave: false,
          saveUninitialized: false,
          secret,
          store,
          cookie: {
            httpOnly: true,
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production',
          },
        },
      };
    },
  });
}
