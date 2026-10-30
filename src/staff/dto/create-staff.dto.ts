import { StaffCategory } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  nameKa: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  /** მაგ.: "მსახიობი", "სამხატვრო ხელმძღვანელი" */
  @IsString()
  @IsNotEmpty()
  positionKa: string;

  @IsOptional()
  @IsString()
  positionEn?: string;

  @IsOptional()
  @IsString()
  bioKa?: string;

  @IsOptional()
  @IsString()
  bioEn?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsEnum(StaffCategory)
  category?: StaffCategory;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
