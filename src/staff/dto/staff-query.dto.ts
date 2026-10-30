import { StaffCategory } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class StaffQueryDto {
  @IsOptional()
  @IsEnum(StaffCategory)
  category?: StaffCategory;
}
