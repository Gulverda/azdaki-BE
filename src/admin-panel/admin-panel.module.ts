import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { buildResources } from './resources';
import { translations } from './translations';

/**
 * AdminJS ადმინპანელი: http://localhost:3000/admin
 *
 * AdminJS-ის პაკეტები მხოლოდ ESM-ია, ჩვენი პროექტი კი CommonJS-ად აიწყობა. ამიტომ
 * მათ ვერ შემოვიტანთ ჩვეულებრივი `import`-ით და ვიყენებთ dynamic `import()`-ს.
 * Nest-ის `imports` მასივი Promise<DynamicModule>-საც იღებს, ეს სწორედ ამისთვისაა.
 */
export async function createAdminPanelModule(): Promise<DynamicModule> {
  const [
    { AdminModule },
    { default: AdminJS, ComponentLoader },
    prismaAdapter,
  ] = await Promise.all([
    import('@adminjs/nestjs'),
    import('adminjs'),
    import('@adminjs/prisma'),
  ]);

  AdminJS.registerAdapter({
    Database: prismaAdapter.Database,
    Resource: prismaAdapter.Resource,
  });
  const componentLoader = new ComponentLoader();

  return AdminModule.createAdminAsync({
    inject: [PrismaService, ConfigService],
    useFactory: async (prisma: PrismaService, config: ConfigService) => {
      const secret = config.getOrThrow<string>('SESSION_SECRET');
      return {
        adminJsOptions: {
          rootPath: '/admin',
          componentLoader,
          resources: await buildResources(prisma, componentLoader),
          branding: {
            companyName: 'Azdaki — ადმინპანელი',
            logo: false,
            withMadeWithLove: false,
          },
          locale: {
            language: 'en',
            availableLanguages: ['en'],
            translations: { en: translations },
          },
        },
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
        sessionOptions: { resave: false, saveUninitialized: false, secret },
      };
    },
  });
}
