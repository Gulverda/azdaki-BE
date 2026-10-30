import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    const valid = admin && (await bcrypt.compare(password, admin.passwordHash));
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    const payload: JwtPayload = { sub: admin.id, email: admin.email };
    return { accessToken: await this.jwt.signAsync(payload) };
  }
}
