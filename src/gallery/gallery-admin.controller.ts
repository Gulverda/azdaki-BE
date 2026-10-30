import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { GalleryQueryDto } from './dto/gallery-query.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';
import { GalleryService } from './gallery.service';

@ApiTags('admin / gallery')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin/gallery')
export class GalleryAdminController {
  constructor(private readonly gallery: GalleryService) {}

  @Get()
  findAll(@Query() query: GalleryQueryDto) {
    return this.gallery.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gallery.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGalleryItemDto) {
    return this.gallery.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGalleryItemDto,
  ) {
    return this.gallery.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gallery.remove(id);
  }
}
