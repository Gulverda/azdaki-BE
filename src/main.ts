import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { AppModule } from './app.module';
import { PrismaRateLimitStore } from './common/rate-limit/prisma-rate-limit.store';
import { PrismaService } from './prisma/prisma.service';
import { UPLOAD_DIR } from './uploads/uploads.controller';

const PLACEHOLDER_IMAGE = join(process.cwd(), 'assets', 'placeholder.jpg');

/**
 * აპის აწყობა listen()-ის გარეშე: ლოკალურად bootstrap() უშვებს პორტზე,
 * Vercel-ზე კი api/index.js იძახებს და Express instance-ს ფუნქციად აბრუნებს.
 */
export async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const prisma = app.get(PrismaService);

  // Vercel-ზე ყველა მოთხოვნა proxy-დან მოდის — ამის გარეშე ყველა ერთ IP-ად ჩაითვლებოდა
  if (process.env.VERCEL) app.set('trust proxy', 1);

  app.setGlobalPrefix('api');
  // crossOriginResourcePolicy: ფრონტი სხვა დომენიდან რომ /uploads სურათებს ხედავდეს
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );

  // პაროლის გამოცნობისგან დაცვა: ერთი IP-დან 15 წუთში 10 მცდელობა, მერე 429.
  // AdminJS-ის ფორმა Nest-ის გარეთ, Express-ის route-ია, ამიტომ ორივეს Express middleware-ით ვზღუდავთ.
  // მთვლელები Postgres-შია, რადგან Vercel-ის instance-ები მეხსიერებას ერთმანეთს არ უზიარებენ.
  const loginRateLimit = (prefix: string) =>
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      skip: (req) => req.method !== 'POST',
      message: {
        statusCode: 429,
        message: 'Too many login attempts, try again in 15 minutes',
      },
      store: new PrismaRateLimitStore(prisma, prefix),
    });

  // სანამ ფაილების საცავი (R2 / Supabase Storage) არ გვაქვს: Vercel-ზე ატვირთული ფაილები იკარგება,
  // ამიტომ /uploads-ის არარსებულ ფაილზე ერთ placeholder სურათს ვაბრუნებთ — ფრონტზე გატეხილი სურათი არ ჩანს.
  // static-ზე ადრე უნდა დარეგისტრირდეს (ServeStaticModule init()-ისას ემატება).
  app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    if (existsSync(join(UPLOAD_DIR, basename(req.path)))) return next();
    res.sendFile(PLACEHOLDER_IMAGE);
  });

  // ⚠ რიგი მნიშვნელოვანია: AdminJS init()-ისას თავის router-ს CORS middleware-ის მომდევნოდ
  // გადაიტანს (@adminjs/nestjs → reorderRoutes), ამიტომ მისი ლიმიტი CORS-მდე უნდა დავარეგისტრიროთ.
  // ფორმა იმავე დომენზეა და CORS არ სჭირდება.
  app.use('/admin/login', loginRateLimit('admin-login:'));
  app.enableCors({
    origin: config.get<string>('CORS_ORIGINS')?.split(',') ?? true,
  });
  // API-ს ლიმიტი კი CORS-ის შემდეგ, რომ 429 პასუხსაც ჰქონდეს CORS header-ები და ფრონტმა წაიკითხოს
  app.use('/api/auth/login', loginRateLimit('api-login:'));

  // whitelist: DTO-ში არ აღწერილ ველებს ჭრის. transform: query string-ს "1"-ს რიცხვად აქცევს და ა.შ.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swagger = new DocumentBuilder()
    .setTitle('Azdaki Theatre API')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, swagger),
  );

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const port = app.get(ConfigService).get<number>('PORT', 3000);
  await app.listen(port);
  console.log(
    `API: http://localhost:${port}/api  |  Docs: http://localhost:${port}/docs`,
  );
}

// `node dist/main` / `nest start` — პირდაპირ გაშვება. Vercel-ზე ფაილი import-ით იტვირთება.
if (require.main === module) void bootstrap();
