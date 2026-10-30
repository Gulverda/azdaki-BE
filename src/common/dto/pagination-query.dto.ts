import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;
}

export function paginate<T>(
  items: T[],
  total: number,
  { page, limit }: PaginationQueryDto,
) {
  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export function skipTake({ page, limit }: PaginationQueryDto) {
  return { skip: (page - 1) * limit, take: limit };
}
