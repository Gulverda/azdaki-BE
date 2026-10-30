import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { Localized } from '../common/i18n/localized.decorator';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';

@ApiTags('about')
@Localized()
@Controller('about')
export class AboutController {
  constructor(private readonly about: AboutService) {}

  @Get()
  getPage() {
    return this.about.getPage();
  }
}

@ApiTags('admin / about')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin/about')
export class AboutAdminController {
  constructor(private readonly about: AboutService) {}

  @Get()
  get() {
    return this.about.findRaw();
  }

  @Put()
  update(@Body() dto: UpdateAboutDto) {
    return this.about.upsert(dto);
  }
}
