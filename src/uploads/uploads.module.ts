import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UPLOAD_DIR, UploadsController } from './uploads.controller';

@Module({
  imports: [
    // ატვირთული ფაილები ხელმისაწვდომია: http://localhost:3000/uploads/<file>
    ServeStaticModule.forRoot({ rootPath: UPLOAD_DIR, serveRoot: '/uploads' }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}
