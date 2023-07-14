import { BadRequestException } from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import { Test, TestingModule } from '@nestjs/testing';

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

jest.mock('sharp', () => {
  const mockSharp = (image: string | Buffer) => mockSharp;
  mockSharp.toFile = () => {};
  mockSharp.metadata = () => {};

  return mockSharp;
});

describe('AppRepository', () => {
  let imagesRepository: ImagesRepository;
  const getPath = (filename: string) =>
    path.join(__dirname, '..', '..', '..', 'public', 'images', filename);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesRepository],
    }).compile();

    imagesRepository = module.get<ImagesRepository>(ImagesRepository);

    jest.restoreAllMocks();
  });

  describe('downloadFrom', () => {
    const setupMocks = () => {
      const spyAxiosGet = jest
        .spyOn(axios, 'get')
        .mockImplementation(
          () => new Promise((resolve) => resolve({ data: 'abc' })),
        );
      const spyFsWriteFileSync = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation(() => {});

      return { spyAxiosGet, spyFsWriteFileSync };
    };

    it('should try to download image from the url provided', async () => {
      const { spyAxiosGet } = setupMocks();
      const url = 'some-valid-image.com';

      await imagesRepository.downloadFrom(url);

      expect(spyAxiosGet).toHaveBeenCalledTimes(1);
      expect(spyAxiosGet).toHaveBeenCalledWith(url, expect.anything());
    });

    it('should try to save image into public/images folder', async () => {
      const { spyFsWriteFileSync } = setupMocks();
      const url = 'some-valid-image.com';

      await imagesRepository.downloadFrom(url);

      expect(spyFsWriteFileSync).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if an invalid image url is provided', async () => {
      const url = 'qwrq.com';

      await expect(imagesRepository.downloadFrom(url)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('save', () => {
    it('should try to save image buffer as a file in public/images folder', async () => {
      const filename = 'some-image.jpeg';
      const path = getPath(filename);
      const spyToFile = jest.spyOn(sharp, 'toFile');

      await imagesRepository.save(filename, Buffer.from('abc'));

      expect(spyToFile).toHaveBeenCalledTimes(1);
      expect(spyToFile).toHaveBeenCalledWith(path);
    });
  });

  describe('getMetadata', () => {
    it('should try to extract metadata from filename located in public/images folder', async () => {
      const filename = 'some-image.jpeg';
      const spyMetadata = jest.spyOn(sharp, 'metadata');

      await imagesRepository.getMetadata(filename);

      expect(spyMetadata).toHaveBeenCalledTimes(1);
    });
  });
});
