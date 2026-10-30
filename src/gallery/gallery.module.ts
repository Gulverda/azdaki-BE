import { Module } from '@nestjs/common';
import { GalleryAdminController } from './gallery-admin.controller';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  controllers: [GalleryController, GalleryAdminController],
  providers: [GalleryService],
})
export class GalleryModule {}
