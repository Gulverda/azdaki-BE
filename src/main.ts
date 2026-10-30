import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  // crossOriginResourcePolicy: ფრონტი სხვა დომენიდან რომ /uploads სურათებს ხედავდეს
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );
  // AdminJS-ის login ფორმა Nest-ის გარეთ, Express-ის route-ია, ამიტომ ThrottlerGuard
  // მას ვერ წვდება — ვზღუდავთ Express middleware-ით (იგივე ლიმიტი, რაც /api/auth/login-ზე).
  // app.use() listen()-მდე უნდა იყოს, რომ AdminJS-ის router-ზე ადრე დარეგისტრირდეს.
  app.use(
    '/admin/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      skip: (req) => req.method !== 'POST',
      message: 'Too many login attempts, try again in 15 minutes',
    }),
  );
  app.enableCors({
    origin: config.get<string>('CORS_ORIGINS')?.split(',') ?? true,
  });

  // whitelist: DTO-ში არ აღწერილ ველებს ჭრის. transform: query string-ს "1"-ს რიცხვად აქცევს და ა.შ.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swagger = new DocumentBuilder()
    .setTitle('Azdaki Theatre API')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, swagger),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(
    `API: http://localhost:${port}/api  |  Docs: http://localhost:${port}/docs`,
  );
}
void bootstrap();
