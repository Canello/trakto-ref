const sharp = require('sharp');
const path = require('path');
import { Injectable } from '@nestjs/common';
import { ImagesRepository } from '../data-storage/images.repository';
import { GenerateThumbnailOptions } from '../utils/images.types';
import {
  catchInvalidImage,
  compressToQuality,
} from '../utils/images.functions';

@Injectable()
export class ThumbnailService {
  private MAX_SIZE = 720;

  constructor(private imagesRepository: ImagesRepository) {}

  // Generate compressed and resized thumbnail image and save it in the file system
  // Only resizes if the bigger side of the original image is greater than MAX_SIZE
  public async generateThumbnail(
    filename: string,
    { compress = 0 }: GenerateThumbnailOptions,
  ) {
    const { width, height } = await this.imagesRepository.getMetadata(filename);
    const biggerSide = Math.max(width, height);
    const thumbnailFilename = this.getThumbnailFilename(filename);

    if (biggerSide > this.MAX_SIZE) {
      await this.compressAndSaveResizedImage(filename, thumbnailFilename, {
        compress,
      });
    } else {
      await this.compressAndSaveOriginalImageCopy(filename, thumbnailFilename, {
        compress,
      });
    }

    return thumbnailFilename;
  }

  // Compress and save resized image
  private async compressAndSaveResizedImage(
    filename: string,
    newFilename: string,
    { compress = 0 }: GenerateThumbnailOptions,
  ) {
    const { width, height } = await this.imagesRepository.getMetadata(filename);
    const path = this.getPath(filename);
    const quality = compressToQuality(compress);

    let newWidth: number, newHeight: number;
    if (width >= height) {
      newWidth = this.MAX_SIZE;
    } else {
      newHeight = this.MAX_SIZE;
    }

    let imageBuffer: Buffer;
    await catchInvalidImage(async () => {
      imageBuffer = await sharp(path)
        .resize(newWidth, newHeight)
        .jpeg({ quality })
        .toBuffer();
    });
    await this.imagesRepository.save(newFilename, imageBuffer);
  }

  // Compress and save copy of original image
  private async compressAndSaveOriginalImageCopy(
    filename: string,
    newFilename: string,
    { compress = 0 }: GenerateThumbnailOptions,
  ) {
    const path = this.getPath(filename);
    const quality = compressToQuality(compress);

    let imageBuffer: Buffer;
    await catchInvalidImage(async () => {
      imageBuffer = await sharp(path).jpeg({ quality }).toBuffer();
    });
    await this.imagesRepository.save(newFilename, imageBuffer);
  }

  // Create thumbnail filename
  private getThumbnailFilename(filename: string) {
    const [filenameWithoutExtension, extension] = filename.split('.');
    return filenameWithoutExtension + '_thumb.' + extension;
  }

  // Create path to filename in the public images folder
  private getPath(filename: string) {
    return path.join(__dirname, '..', '..', '..', 'public', 'images', filename);
  }
}
