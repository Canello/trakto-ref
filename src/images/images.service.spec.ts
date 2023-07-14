import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { ImagesRepository } from './data-storage/images.repository';
import { ThumbnailService } from './image-transformers/thumbnail.service';
import { BlurService } from './image-transformers/blur.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Metadata } from './data-storage/metadata.entity';
import { Repository } from 'typeorm';

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let fakeMetadataRepository: any;

  beforeEach(async () => {
    fakeMetadataRepository = {
      create({ image, compress }: { image: string; compress: number }) {
        return { image, compress };
      },
      save(newMetadata: Partial<Metadata>) {
        return Promise.resolve(newMetadata);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        ImagesRepository,
        {
          provide: getRepositoryToken(Metadata),
          useValue: fakeMetadataRepository,
        },
        ThumbnailService,
        BlurService,
      ],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
    fakeMetadataRepository = module.get<Repository<Metadata>>(
      getRepositoryToken(Metadata),
    );
  });

  it('should be defined', () => {
    expect(imagesService).toBeDefined();
  });
});
