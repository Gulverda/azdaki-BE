import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global: ერთხელ ვაიმპორტებთ AppModule-ში და PrismaService ყველა მოდულში ხელმისაწვდომია
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
