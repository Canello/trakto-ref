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

  // Generate compressed and resized image and returns a buffer
  // Only resizes if the larger side of the original image is greater than MAX_SIZE
  public async generate(
    filename: string,
    { compress = 0 }: GenerateThumbnailOptions,
  ) {
    const { width, height } = await this.imagesRepository.getMetadata(filename);
    const largerSide = Math.max(width, height);

    let imageBuffer: Buffer;
    if (largerSide > this.MAX_SIZE) {
      imageBuffer = await this.compressAndResizeImage(filename, {
        compress,
      });
    } else {
      imageBuffer = await this.compressImage(filename, {
        compress,
      });
    }

    return imageBuffer;
  }

  // Create thumbnail filename
  public getFilename(filename: string) {
    const [filenameWithoutExtension, extension] = filename.split('.');
    return filenameWithoutExtension + '_thumb.' + extension;
  }

  // Compress and save resized image
  private async compressAndResizeImage(
    filename: string,
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

    return imageBuffer;
  }

  // Compress and save copy of original image
  private async compressImage(
    filename: string,
    { compress = 0 }: GenerateThumbnailOptions,
  ) {
    const path = this.getPath(filename);
    const quality = compressToQuality(compress);

    let imageBuffer: Buffer;
    await catchInvalidImage(async () => {
      imageBuffer = await sharp(path).jpeg({ quality }).toBuffer();
    });

    return imageBuffer;
  }

  // Create path to filename in the public images folder
  private getPath(filename: string) {
    return path.join(__dirname, '..', '..', '..', 'public', 'images', filename);
  }
}
