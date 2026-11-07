import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';
import { AdminGuard } from '../auth/admin.guard';

// Vercel-ზე პროექტის დისკი read-only-ა და მხოლოდ /tmp იწერება (instance-ის გაჩერებისას იშლება).
// დროებითია — R2-ზე გადასვლისას ფაილები bucket-ში წავა და ეს ხაზი აღარ დაგვჭირდება.
export const UPLOAD_DIR = process.env.VERCEL
  ? join(tmpdir(), 'uploads')
  : join(process.cwd(), 'uploads');
mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB — ვიდეოებისთვის

@ApiTags('admin / uploads')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin/uploads')
export class UploadsController {
  /** აბრუნებს url-ს, რომელსაც შემდეგ ვწერთ coverImage / photo / gallery url ველში */
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) =>
          cb(
            null,
            `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
          ),
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        const ok = /^(image|video)\//.test(file.mimetype);
        cb(ok ? null : new BadRequestException('Only images and videos'), ok);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return {
      url: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
