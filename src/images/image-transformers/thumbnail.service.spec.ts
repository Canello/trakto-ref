import { Test, TestingModule } from '@nestjs/testing';
import { ThumbnailService } from './thumbnail.service';
import { ImagesRepository } from '../data-storage/images.repository';
import { compressToQuality } from '../utils/images.functions';

const sharp = require('sharp');

jest.mock('sharp', () => {
  const mockSharp = (image: string | Buffer) => mockSharp;
  mockSharp.resize = () => mockSharp;
  mockSharp.jpeg = () => mockSharp;
  mockSharp.toBuffer = () => mockSharp;

  return mockSharp;
});

describe('ThumbnailService', () => {
  let thumbnailService: ThumbnailService;
  let fakeImagesRepository: any;

  beforeEach(async () => {
    fakeImagesRepository = {
      save: () => {},
      getMetadata: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThumbnailService,
        {
          provide: ImagesRepository,
          useValue: fakeImagesRepository,
        },
      ],
    }).compile();

    thumbnailService = module.get<ThumbnailService>(ThumbnailService);

    jest.restoreAllMocks();
    jest
      .spyOn(fakeImagesRepository, 'getMetadata')
      .mockResolvedValue({ width: 900, height: 1000 });
  });

  it('should be defined', () => {
    expect(thumbnailService).toBeDefined();
  });

  it('should compress image', async () => {
    const spyJpeg = jest.spyOn(sharp, 'jpeg');
    const compress = 0.5;
    const quality = compressToQuality(compress);

    await thumbnailService.generate('some-image.jpeg', { compress: 0.5 });

    expect(spyJpeg).toHaveBeenCalledTimes(1);
    expect(spyJpeg).toHaveBeenCalledWith({ quality });
  });

  it('should resize image if larger side is bigger than 720px', async () => {
    const spyResize = jest.spyOn(sharp, 'resize');

    await thumbnailService.generate('some-image.jpeg', {
      compress: 0.5,
    });

    expect(spyResize).toHaveBeenCalledTimes(1);
  });

  it('should not resize image if larger side is smaller than or equal 720px', async () => {
    const spyResize = jest.spyOn(sharp, 'resize');
    jest
      .spyOn(fakeImagesRepository, 'getMetadata')
      .mockResolvedValue({ width: 400, height: 400 });

    await thumbnailService.generate('some-image2.jpeg', {
      compress: 0.5,
    });

    expect(spyResize).toHaveBeenCalledTimes(0);
  });

  it('should generate a buffer', async () => {
    const spyToBuffer = jest.spyOn(sharp, 'toBuffer');

    await thumbnailService.generate('some-image.jpeg', { compress: 0.5 });

    expect(spyToBuffer).toHaveBeenCalledTimes(1);
  });
});
