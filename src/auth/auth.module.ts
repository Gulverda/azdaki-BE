import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // global: true → JwtService (და შესაბამისად AdminGuard) ყველა მოდულში მუშაობს
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '7d') },
      }),
    }),
    // ერთი IP-დან 15 წუთში მაქსიმუმ 10 მცდელობა, მერე 429.
    // მოქმედებს მხოლოდ იქ, სადაც ThrottlerGuard დგას (login), დანარჩენ API-ზე არა
    ThrottlerModule.forRoot([{ limit: 10, ttl: minutes(15) }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
