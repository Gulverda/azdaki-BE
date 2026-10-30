import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Localized } from '../common/i18n/localized.decorator';
import { StaffQueryDto } from './dto/staff-query.dto';
import { StaffService } from './staff.service';

@ApiTags('staff')
@Localized()
@Controller('staff')
export class StaffController {
  constructor(private readonly staff: StaffService) {}

  @Get()
  findAll(@Query() query: StaffQueryDto) {
    return this.staff.findActive(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.staff.findActiveById(id);
  }
}
