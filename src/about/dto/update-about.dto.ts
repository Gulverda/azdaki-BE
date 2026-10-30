import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsNotEmpty()
  titleKa: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  /** თეატრის ისტორია / აღწერა (HTML) */
  @IsString()
  @IsNotEmpty()
  contentKa: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  heroImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  /** მოკლე ვიდეოები: ატვირთული ფაილები ან YouTube ლინკები */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];
}
