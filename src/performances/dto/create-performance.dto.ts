import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';

export class CastMemberDto {
  @IsInt()
  staffId: number;

  /** როლი სპექტაკლში, მაგ.: "ჰამლეტი", "რეჟისორი" */
  @IsOptional()
  @IsString()
  roleKa?: string;

  @IsOptional()
  @IsString()
  roleEn?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class ShowtimeDto {
  @IsDateString()
  startsAt: string;

  @IsOptional()
  @IsString()
  venueKa?: string;

  @IsOptional()
  @IsString()
  venueEn?: string;

  @IsOptional()
  @IsUrl()
  ticketUrl?: string;
}

/**
 * images / cast / showtimes: თუ update-ში გადმოგვაწვდიან, ძველი სია მთლიანად
 * ჩანაცვლდება ახლით. ადმინკის ფორმისთვის ეს ყველაზე მარტივი მიდგომაა.
 */
export class CreatePerformanceDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  titleKa: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  /** მოკლე აღწერა ბარათებისთვის (სია) */
  @IsOptional()
  @IsString()
  shortDescriptionKa?: string;

  @IsOptional()
  @IsString()
  shortDescriptionEn?: string;

  /** სრული აღწერა (HTML) დეტალური გვერდისთვის */
  @IsString()
  @IsNotEmpty()
  descriptionKa: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  /** პიესის ავტორი, მაგ.: "უილიამ შექსპირი" */
  @IsOptional()
  @IsString()
  authorKa?: string;

  @IsOptional()
  @IsString()
  authorEn?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  /** ასაკობრივი შეზღუდვა, მაგ.: 12 → "12+" */
  @IsOptional()
  @IsInt()
  @Min(0)
  ageRestriction?: number;

  @IsOptional()
  @IsDateString()
  premiereDate?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  /** YouTube ლინკი ან ატვირთული ვიდეო */
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CastMemberDto)
  cast?: CastMemberDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShowtimeDto)
  showtimes?: ShowtimeDto[];
}
