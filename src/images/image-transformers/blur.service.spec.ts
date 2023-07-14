import { Test, TestingModule } from '@nestjs/testing';
import { BlurService } from './blur.service';
import { ImagesRepository } from '../data-storage/images.repository';
import { compressToQuality } from '../utils/images.functions';

const sharp = require('sharp');

jest.mock('sharp', () => {
  const mockSharp = (image: string | Buffer) => mockSharp;
  mockSharp.jpeg = () => mockSharp;
  mockSharp.toBuffer = () => mockSharp;
  mockSharp.blur = () => mockSharp;

  return mockSharp;
});

describe('BlurService', () => {
  let blurService: BlurService;
  let fakeImagesRepository: any;

  beforeEach(async () => {
    fakeImagesRepository = {
      save: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BlurService, ImagesRepository],
    }).compile();

    blurService = module.get<BlurService>(BlurService);

    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(blurService).toBeDefined();
  });

  it('should compress image', async () => {
    const spyJpeg = jest.spyOn(sharp, 'jpeg');
    const compress = 0.5;
    const quality = compressToQuality(compress);

    await blurService.generate('some-image.jpeg', { compress: 0.5, blur: 10 });

    expect(spyJpeg).toHaveBeenCalledTimes(1);
    expect(spyJpeg).toHaveBeenCalledWith({ quality });
  });

  it('should blur image', async () => {
    const spyBlur = jest.spyOn(sharp, 'blur');
    const blur = 10;

    await blurService.generate('some-image.jpeg', { compress: 0.5, blur });

    expect(spyBlur).toHaveBeenCalledTimes(1);
    expect(spyBlur).toHaveBeenCalledWith(blur);
  });

  it('should generate a buffer', async () => {
    const spyToBuffer = jest.spyOn(sharp, 'toBuffer');

    await blurService.generate('some-image.jpeg', { compress: 0.5, blur: 10 });

    expect(spyToBuffer).toHaveBeenCalledTimes(1);
  });
});
