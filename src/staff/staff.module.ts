import { Module } from '@nestjs/common';
import { StaffAdminController } from './staff-admin.controller';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  controllers: [StaffController, StaffAdminController],
  providers: [StaffService],
})
export class StaffModule {}
