const path = require('path');
const sharp = require('sharp');
import { Injectable } from '@nestjs/common';
import { ImagesRepository } from '../data-storage/images.repository';
import { GenerateBlurredImageOptions } from '../utils/images.types';
import {
  catchInvalidImage,
  compressToQuality,
} from '../utils/images.functions';

@Injectable()
export class BlurService {
  constructor(private imagesRepository: ImagesRepository) {}

  public async generateBlurredImage(
    filename: string,
    { compress = 0, blur = 0 }: GenerateBlurredImageOptions,
  ) {
    const blurredImageFilename = this.getBlurredImageFilename(filename);
    const originalPath = this.getPath(filename);
    const quality = compressToQuality(compress);

    let imageBuffer: Buffer;
    await catchInvalidImage(async () => {
      imageBuffer = await sharp(originalPath)
        .blur(blur)
        .jpeg({ quality })
        .toBuffer();
    });
    await this.imagesRepository.save(blurredImageFilename, imageBuffer);

    return blurredImageFilename;
  }

  // Create blurred image filename
  private getBlurredImageFilename(filename: string) {
    const [filenameWithoutExtension, extension] = filename.split('.');
    return filenameWithoutExtension + '_blurred.' + extension;
  }

  // Create path to filename in the public images folder
  private getPath(filename: string) {
    return path.join(__dirname, '..', '..', '..', 'public', 'images', filename);
  }
}
