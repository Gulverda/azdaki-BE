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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

@ApiTags('admin / news')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin/news')
export class NewsAdminController {
  constructor(private readonly news: NewsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.news.findAll(query);
  }

  // ParseIntPipe: "5" → 5, "abc" → 400 Bad Request
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.news.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNewsDto) {
    return this.news.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsDto) {
    return this.news.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.news.remove(id);
  }
}
