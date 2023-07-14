import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateThumbnailDto } from 'src/images/dtos/create-thumbnail.dto';
import { Repository } from 'typeorm';
import { ThumbnailService } from './image-transformers/thumbnail.service';
import { ImagesRepository } from './data-storage/images.repository';
import { Metadata } from './data-storage/metadata.entity';
import { CreateBlurredImageDto } from './dtos/create-blurred-image.dto';
import { BlurService } from './image-transformers/blur.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Metadata)
    private metadataRepository: Repository<Metadata>,
    private imagesRepository: ImagesRepository,
    private thumbnailService: ThumbnailService,
    private blurService: BlurService,
  ) {}

  async createThumbnail({ image, compress }: CreateThumbnailDto) {
    // Download image and save it on public/images folder
    const filename = await this.imagesRepository.downloadFrom(image);

    // Save metadata on MongoDB
    const metadata = await this.imagesRepository.getMetadata(filename);
    const newMetadata = this.metadataRepository.create({ filename, metadata });
    const savedMetadata = await this.metadataRepository.save(newMetadata);

    // Create thumbnail and save it on public/images folder
    const thumbnailFilename = await this.thumbnailService.generateThumbnail(
      filename,
      { compress },
    );

    // Send reponse
    return {
      localpath: {
        original: process.env.API_ADDRESS + '/images/' + filename,
        thumb: process.env.API_ADDRESS + '/images/' + thumbnailFilename,
      },
      metadata: savedMetadata.metadata,
    };
  }

  async createBlurredImage({ image, compress, blur }: CreateBlurredImageDto) {
    // Download image and save it on public/images folder
    const filename = await this.imagesRepository.downloadFrom(image);

    // Create blurred image and save it on public/images folder
    const blurredImageFilename = await this.blurService.generateBlurredImage(
      filename,
      { compress, blur },
    );

    // Send reponse
    return {
      localpath: {
        original: process.env.API_ADDRESS + '/images/' + filename,
        blurred: process.env.API_ADDRESS + '/images/' + blurredImageFilename,
      },
    };
  }
}
