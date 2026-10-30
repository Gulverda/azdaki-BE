import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate, skipTake } from '../common/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { GalleryQueryDto } from './dto/gallery-query.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GalleryQueryDto) {
    const where: Prisma.GalleryItemWhereInput = {
      type: query.type,
      performanceId: query.performanceId,
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.galleryItem.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          performance: {
            select: { id: true, slug: true, titleKa: true, titleEn: true },
          },
        },
        ...skipTake(query),
      }),
      this.prisma.galleryItem.count({ where }),
    ]);
    return paginate(items, total, query);
  }

  findOne(id: number) {
    return this.prisma.galleryItem.findUniqueOrThrow({ where: { id } });
  }

  create(dto: CreateGalleryItemDto) {
    return this.prisma.galleryItem.create({ data: dto });
  }

  update(id: number, dto: UpdateGalleryItemDto) {
    return this.prisma.galleryItem.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.galleryItem.delete({ where: { id } });
  }
}
