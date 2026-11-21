import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

/** "ჩვენს შესახებ → თეატრის ისტორია" — სექციები საიტის სტრუქტურის მიხედვით */
export class UpdateAboutDto {
  @IsString()
  @IsNotEmpty()
  titleKa: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  /** მაგ. "ინკლუზიური თეატრი" */
  @IsOptional()
  @IsString()
  subtitleKa?: string;

  @IsOptional()
  @IsString()
  subtitleEn?: string;

  /** დაარსების წელი (badge) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  @Max(2100)
  foundedYear?: number;

  /** შესავალი აბზაცი */
  @IsOptional()
  @IsString()
  introKa?: string;

  @IsOptional()
  @IsString()
  introEn?: string;

  /** "ვინ ვართ" */
  @IsOptional()
  @IsString()
  whoWeAreKa?: string;

  @IsOptional()
  @IsString()
  whoWeAreEn?: string;

  /** "დაარსება" */
  @IsOptional()
  @IsString()
  foundingKa?: string;

  @IsOptional()
  @IsString()
  foundingEn?: string;

  /** "მიზნები" */
  @IsOptional()
  @IsString()
  goalsKa?: string;

  @IsOptional()
  @IsString()
  goalsEn?: string;

  /** "ამოცანები" — სიის პუნქტები */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tasksKa?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tasksEn?: string[];

  /** "მიღწევები" — სიის პუნქტები */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievementsKa?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievementsEn?: string[];

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
