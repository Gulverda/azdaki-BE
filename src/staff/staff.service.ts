import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffQueryDto } from './dto/staff-query.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  findActive({ category }: StaffQueryDto) {
    return this.prisma.staffMember.findMany({
      where: { isActive: true, category },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      omit: { bioKa: true, bioEn: true },
    });
  }

  /** მსახიობის გვერდი — ბიოგრაფია + სპექტაკლები, სადაც მონაწილეობს */
  async findActiveById(id: number) {
    const member = await this.prisma.staffMember.findFirst({
      where: { id, isActive: true },
      include: {
        roles: {
          where: { performance: { isPublished: true } },
          orderBy: { performance: { premiereDate: 'desc' } },
          select: {
            roleKa: true,
            roleEn: true,
            performance: {
              select: {
                id: true,
                slug: true,
                titleKa: true,
                titleEn: true,
                coverImage: true,
              },
            },
          },
        },
      },
    });
    if (!member) throw new NotFoundException('Staff member not found');
    return member;
  }

  findAll() {
    return this.prisma.staffMember.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.staffMember.findUniqueOrThrow({ where: { id } });
  }

  create(dto: CreateStaffDto) {
    return this.prisma.staffMember.create({ data: dto });
  }

  update(id: number, dto: UpdateStaffDto) {
    return this.prisma.staffMember.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.staffMember.delete({ where: { id } });
  }
}
