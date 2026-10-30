import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { PerformancesService } from './performances.service';

@ApiTags('admin / performances')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin/performances')
export class PerformancesAdminController {
  constructor(private readonly performances: PerformancesService) {}

  @Get()
  findAll() {
    return this.performances.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.performances.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePerformanceDto) {
    return this.performances.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePerformanceDto,
  ) {
    return this.performances.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.performances.remove(id);
  }
}
