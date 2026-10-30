import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Localized } from '../common/i18n/localized.decorator';
import { PerformancesService } from './performances.service';

@ApiTags('performances')
@Localized()
@Controller('performances')
export class PerformancesController {
  constructor(private readonly performances: PerformancesService) {}

  @Get()
  findAll() {
    return this.performances.findPublished();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.performances.findPublishedBySlug(slug);
  }
}
