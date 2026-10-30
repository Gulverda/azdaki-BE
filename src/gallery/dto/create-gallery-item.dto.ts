import { MediaType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGalleryItemDto {
  @IsEnum(MediaType)
  type: MediaType;

  /** ატვირთული ფაილის url (/uploads/...) ან YouTube/Vimeo ლინკი */
  @IsString()
  @IsNotEmpty()
  url: string;

  /** ვიდეოს preview სურათი */
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  titleKa?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  /** თუ მასალა კონკრეტულ სპექტაკლს ეკუთვნის, ის მის დეტალურ გვერდზეც გამოჩნდება */
  @IsOptional()
  @IsInt()
  performanceId?: number;
}
