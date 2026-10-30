import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AdminGuard } from './admin.guard';
import { AuthService } from './auth.service';
import { CurrentAdmin } from './current-admin.decorator';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './jwt-payload';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // პაროლის გამოცნობისგან დაცვა — ლიმიტი იხ. auth.module.ts (ThrottlerModule)
  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  me(@CurrentAdmin() admin: JwtPayload) {
    return admin;
  }
}
