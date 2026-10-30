import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Localized } from '../common/i18n/localized.decorator';
import { NewsService } from './news.service';

/**
 * Express-ში: router.get('/news', handler). Nest-ში: class + decorator-ები.
 * @Query() / @Param() ავტომატურად ამოიღებს და დაავალიდირებს მონაცემს.
 */
@ApiTags('news')
@Localized()
@Controller('news')
export class NewsController {
  constructor(private readonly news: NewsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.news.findPublished(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.news.findPublishedBySlug(slug);
  }
}
