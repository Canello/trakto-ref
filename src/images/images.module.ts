import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThumbnailService } from './image-transformers/thumbnail.service';
import { Metadata } from './data-storage/metadata.entity';
import { ImagesRepository } from './data-storage/images.repository';
import { BlurService } from './image-transformers/blur.service';

@Module({
  imports: [TypeOrmModule.forFeature([Metadata])],
  providers: [ImagesService, ImagesRepository, ThumbnailService, BlurService],
  controllers: [ImagesController],
})
export class ImagesModule {}
