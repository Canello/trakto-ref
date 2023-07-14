import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { ImagesRepository } from './data-storage/images.repository';
import { ThumbnailService } from './image-transformers/thumbnail.service';
import { BlurService } from './image-transformers/blur.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Metadata } from './data-storage/metadata.entity';
import { Repository } from 'typeorm';
import {
  makeMockBlurService,
  makeMockImagesRepository,
  makeMockMetadataRepository,
  makeMockThumbnailService,
} from './utils/images.mocks';

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let fakeMetadataRepository: any;
  let fakeImagesRepository: any;
  let fakeThumbnailService: any;
  let fakeBlurService: any;

  beforeEach(async () => {
    fakeMetadataRepository = makeMockMetadataRepository();
    fakeImagesRepository = makeMockImagesRepository();
    fakeThumbnailService = makeMockThumbnailService();
    fakeBlurService = makeMockBlurService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: ImagesRepository,
          useValue: fakeImagesRepository,
        },
        {
          provide: getRepositoryToken(Metadata),
          useValue: fakeMetadataRepository,
        },
        {
          provide: ThumbnailService,
          useValue: fakeThumbnailService,
        },
        {
          provide: BlurService,
          useValue: fakeBlurService,
        },
      ],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
    fakeMetadataRepository = module.get<Repository<Metadata>>(
      getRepositoryToken(Metadata),
    );

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(imagesService).toBeDefined();
  });

  describe('createThumbnail', () => {
    it('should download file from provided url', async () => {
      const spyDownloadFrom = jest.spyOn(fakeImagesRepository, 'downloadFrom');
      const filename = 'some-filename.jpeg';

      await imagesService.createThumbnail({ image: filename, compress: 0.5 });

      expect(spyDownloadFrom).toHaveBeenCalledTimes(1);
      expect(spyDownloadFrom).toHaveBeenCalledWith(filename);
    });

    it('should save metadata on MongoDB', async () => {
      const spySave = jest.spyOn(fakeMetadataRepository, 'save');
      const filename = 'some-filename.jpeg';

      await imagesService.createThumbnail({ image: filename, compress: 0.5 });

      expect(spySave).toHaveBeenCalledTimes(1);
    });

    it('should save thumbnail on file system', async () => {
      const spySave = jest.spyOn(fakeImagesRepository, 'save');
      const filename = 'some-filename.jpeg';
      const thumbnailFilename = 'some-filename_thumb.jpeg';

      await imagesService.createThumbnail({ image: filename, compress: 0.5 });

      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledWith(
        thumbnailFilename,
        expect.anything(),
      );
    });
  });

  describe('createBlurredImage', () => {
    it('should download file from provided url', async () => {
      const spyDownloadFrom = jest.spyOn(fakeImagesRepository, 'downloadFrom');
      const filename = 'some-filename.jpeg';

      await imagesService.createBlurredImage({
        image: filename,
        compress: 0.5,
        blur: 10,
      });

      expect(spyDownloadFrom).toHaveBeenCalledTimes(1);
      expect(spyDownloadFrom).toHaveBeenCalledWith(filename);
    });

    it('should save blurred image on file system', async () => {
      const spySave = jest.spyOn(fakeImagesRepository, 'save');
      const filename = 'some-filename.jpeg';
      const blurredImageFilename = 'some-filename_blurred.jpeg';

      await imagesService.createBlurredImage({
        image: filename,
        compress: 0.5,
        blur: 10,
      });

      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledWith(
        blurredImageFilename,
        expect.anything(),
      );
    });
  });
});
