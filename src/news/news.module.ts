import { Module } from '@nestjs/common';
import { NewsAdminController } from './news-admin.controller';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

/** მოდული აერთიანებს ერთი feature-ის controller-ებს და provider-ებს (service-ებს) */
@Module({
  controllers: [NewsController, NewsAdminController],
  providers: [NewsService],
})
export class NewsModule {}
