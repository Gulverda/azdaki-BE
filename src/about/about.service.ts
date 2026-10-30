import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutDto } from './dto/update-about.dto';

const ABOUT_ID = 1;

@Injectable()
export class AboutService {
  constructor(private readonly prisma: PrismaService) {}

  /** "ჩვენს შესახებ" — კონტენტი + სპექტაკლები + სტაფი ერთ პასუხში */
  async getPage() {
    const [page, performances, staff] = await this.prisma.$transaction([
      this.prisma.aboutPage.findUnique({ where: { id: ABOUT_ID } }),
      this.prisma.performance.findMany({
        where: { isPublished: true },
        orderBy: [{ order: 'asc' }, { premiereDate: 'desc' }],
        select: {
          id: true,
          slug: true,
          titleKa: true,
          titleEn: true,
          shortDescriptionKa: true,
          shortDescriptionEn: true,
          coverImage: true,
        },
      }),
      this.prisma.staffMember.findMany({
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        omit: { bioKa: true, bioEn: true },
      }),
    ]);
    if (!page) throw new NotFoundException('About page is not set up yet');
    return { ...page, performances, staff };
  }

  findRaw() {
    return this.prisma.aboutPage.findUnique({ where: { id: ABOUT_ID } });
  }

  upsert(dto: UpdateAboutDto) {
    return this.prisma.aboutPage.upsert({
      where: { id: ABOUT_ID },
      create: { id: ABOUT_ID, ...dto },
      update: dto,
    });
  }
}
