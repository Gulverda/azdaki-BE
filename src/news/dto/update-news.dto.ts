import { PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';

// ყველა ველი ხდება optional, validation წესები კი რჩება
export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
