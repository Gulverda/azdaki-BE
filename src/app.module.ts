import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AboutModule } from './about/about.module';
import { createAdminPanelModule } from './admin-panel/admin-panel.module';
import { AuthModule } from './auth/auth.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { GalleryModule } from './gallery/gallery.module';
import { NewsModule } from './news/news.module';
import { PerformancesModule } from './performances/performances.module';
import { PrismaModule } from './prisma/prisma.module';
import { StaffModule } from './staff/staff.module';
import { UploadsModule } from './uploads/uploads.module';

/** root მოდული: აქ "ერთდება" აპლიკაციის ყველა ნაწილი */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env → ConfigService
    PrismaModule,
    AuthModule,
    UploadsModule,
    NewsModule,
    PerformancesModule,
    StaffModule,
    GalleryModule,
    AboutModule,
    createAdminPanelModule(), // ადმინპანელი: /admin
  ],
  providers: [{ provide: APP_FILTER, useClass: PrismaExceptionFilter }],
})
export class AppModule {}
