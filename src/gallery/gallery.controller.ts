import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Localized } from '../common/i18n/localized.decorator';
import { GalleryQueryDto } from './dto/gallery-query.dto';
import { GalleryService } from './gallery.service';

@ApiTags('gallery')
@Localized()
@Controller('gallery')
export class GalleryController {
  constructor(private readonly gallery: GalleryService) {}

  @Get()
  findAll(@Query() query: GalleryQueryDto) {
    return this.gallery.findAll(query);
  }
}
