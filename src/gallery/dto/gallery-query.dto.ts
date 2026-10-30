import { MediaType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class GalleryQueryDto extends PaginationQueryDto {
  /** IMAGE — ფოტოები, VIDEO — ვიდეოები */
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  performanceId?: number;
}
