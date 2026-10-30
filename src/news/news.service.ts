import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PaginationQueryDto,
  paginate,
  skipTake,
} from '../common/dto/pagination-query.dto';
import { slugify, uniqueSlug } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

/**
 * Service-ში არის ბიზნეს ლოგიკა და ბაზასთან მუშაობა. Controller მხოლოდ HTTP-ს
 * უყურებს და აქ გადმოგვაწვდის მონაცემს. PrismaService-ს DI (Dependency Injection)
 * გვაწვდის constructor-ით, ამიტომ `new` ან import-ით გლობალური instance არ გვჭირდება.
 */
@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- საჯარო ----------

  async findPublished(query: PaginationQueryDto) {
    const where = { isPublished: true };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        omit: { contentKa: true, contentEn: true }, // სიაში სრული ტექსტი არ გვჭირდება
        ...skipTake(query),
      }),
      this.prisma.news.count({ where }),
    ]);
    return paginate(items, total, query);
  }

  async findPublishedBySlug(slug: string) {
    const news = await this.prisma.news.findFirst({
      where: { slug, isPublished: true },
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  // ---------- ადმინი ----------

  async findAll(query: PaginationQueryDto) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        omit: { contentKa: true, contentEn: true },
        ...skipTake(query),
      }),
      this.prisma.news.count(),
    ]);
    return paginate(items, total, query);
  }

  findOne(id: number) {
    return this.prisma.news.findUniqueOrThrow({ where: { id } });
  }

  async create({ slug, ...dto }: CreateNewsDto) {
    return this.prisma.news.create({
      data: {
        ...dto,
        slug: slug
          ? slugify(slug)
          : await uniqueSlug(dto.titleEn || dto.titleKa, (s) =>
              this.slugTaken(s),
            ),
        publishedAt: dto.publishedAt ?? (dto.isPublished ? new Date() : null),
      },
    });
  }

  async update(id: number, { slug, ...dto }: UpdateNewsDto) {
    const current = await this.findOne(id);
    return this.prisma.news.update({
      where: { id },
      data: {
        ...dto,
        ...(slug && { slug: slugify(slug) }),
        // პირველად გამოქვეყნებისას თარიღი ავტომატურად ჩაიწერება
        ...(dto.isPublished &&
          !current.publishedAt &&
          !dto.publishedAt && {
            publishedAt: new Date(),
          }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.news.delete({ where: { id } });
  }

  private async slugTaken(slug: string) {
    return !!(await this.prisma.news.findUnique({ where: { slug } }));
  }
}
