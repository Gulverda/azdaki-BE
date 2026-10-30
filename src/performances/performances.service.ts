import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { slugify, uniqueSlug } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

const upcomingShowtimes = () =>
  ({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: 'asc' },
  }) satisfies Prisma.Performance$showtimesArgs;

const castWithStaff = {
  orderBy: { order: 'asc' },
  include: {
    staff: {
      select: {
        id: true,
        nameKa: true,
        nameEn: true,
        positionKa: true,
        positionEn: true,
        photo: true,
      },
    },
  },
} satisfies Prisma.Performance$castArgs;

const ADMIN_INCLUDE = {
  images: { orderBy: { order: 'asc' } },
  cast: castWithStaff,
  showtimes: { orderBy: { startsAt: 'asc' } },
} satisfies Prisma.PerformanceInclude;

@Injectable()
export class PerformancesService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- საჯარო ----------

  /** სპექტაკლების გვერდი: ბარათები + უახლოესი ჩვენება */
  findPublished() {
    return this.prisma.performance.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { premiereDate: 'desc' }],
      omit: { descriptionKa: true, descriptionEn: true },
      include: { showtimes: { ...upcomingShowtimes(), take: 1 } },
    });
  }

  /** დეტალური გვერდი */
  async findPublishedBySlug(slug: string) {
    const performance = await this.prisma.performance.findFirst({
      where: { slug, isPublished: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        cast: {
          ...castWithStaff,
          where: { staff: { isActive: true } },
        },
        showtimes: upcomingShowtimes(),
        galleryItems: { orderBy: { order: 'asc' } },
      },
    });
    if (!performance) throw new NotFoundException('Performance not found');
    return performance;
  }

  // ---------- ადმინი ----------

  findAll() {
    return this.prisma.performance.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      omit: { descriptionKa: true, descriptionEn: true },
    });
  }

  findOne(id: number) {
    return this.prisma.performance.findUniqueOrThrow({
      where: { id },
      include: ADMIN_INCLUDE,
    });
  }

  async create({
    slug,
    images,
    cast,
    showtimes,
    ...dto
  }: CreatePerformanceDto) {
    return this.prisma.performance.create({
      data: {
        ...dto,
        slug: slug
          ? slugify(slug)
          : await uniqueSlug(dto.titleEn || dto.titleKa, (s) =>
              this.slugTaken(s),
            ),
        images: images && {
          create: images.map((url, order) => ({ url, order })),
        },
        cast: cast && { create: cast },
        showtimes: showtimes && { create: showtimes },
      },
      include: ADMIN_INCLUDE,
    });
  }

  update(
    id: number,
    { slug, images, cast, showtimes, ...dto }: UpdatePerformanceDto,
  ) {
    // deleteMany: {} + create — ძველი ჩანაწერები იშლება და ახლები იწერება ერთ query-ში
    return this.prisma.performance.update({
      where: { id },
      data: {
        ...dto,
        ...(slug && { slug: slugify(slug) }),
        images: images && {
          deleteMany: {},
          create: images.map((url, order) => ({ url, order })),
        },
        cast: cast && { deleteMany: {}, create: cast },
        showtimes: showtimes && { deleteMany: {}, create: showtimes },
      },
      include: ADMIN_INCLUDE,
    });
  }

  remove(id: number) {
    return this.prisma.performance.delete({ where: { id } });
  }

  private async slugTaken(slug: string) {
    return !!(await this.prisma.performance.findUnique({ where: { slug } }));
  }
}
