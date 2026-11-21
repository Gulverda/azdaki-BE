import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutDto } from './dto/update-about.dto';

const ABOUT_ID = 1;

@Injectable()
export class AboutService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * "ჩვენს შესახებ → თეატრის ისტორია": სექციები + სპონსორები.
   * დასი (სამხატვრო ხელმძღვანელი, რეჟისორი, მსახიობები, შემოქმედებითი ჯგუფი,
   * ადმინისტრაცია) ცალკე მოდის: GET /api/staff?category=...
   */
  async getPage() {
    const [page, sponsors] = await this.prisma.$transaction([
      this.prisma.aboutPage.findUnique({ where: { id: ABOUT_ID } }),
      this.prisma.sponsor.findMany({
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        select: { id: true, nameKa: true, nameEn: true, logo: true, url: true },
      }),
    ]);
    if (!page) throw new NotFoundException('About page is not set up yet');
    return { ...page, sponsors };
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
