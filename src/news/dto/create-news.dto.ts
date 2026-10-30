import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * DTO = Data Transfer Object. class-validator-ის decorator-ები ამოწმებს body-ს
 * ValidationPipe-ის დახმარებით, Express-ში ხელით ან Joi-ით რომ ამოწმებდი, ის აქ ავტომატურია.
 * slug თუ არ მოგვაწოდეს, სათაურიდან დაგენერირდება.
 */
export class CreateNewsDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  titleKa: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  excerptKa?: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  /** HTML (rich text editor-იდან) */
  @IsString()
  @IsNotEmpty()
  contentKa: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
