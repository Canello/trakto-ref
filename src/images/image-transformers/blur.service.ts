const path = require('path');
const sharp = require('sharp');
import { Injectable } from '@nestjs/common';
import { GenerateBlurredImageOptions } from '../utils/images.types';
import {
  catchInvalidImage,
  compressToQuality,
} from '../utils/images.functions';

@Injectable()
export class BlurService {
  // Generate compressed and blurred image and returns a buffer
  public async generate(
    filename: string,
    { compress = 0, blur = 0 }: GenerateBlurredImageOptions,
  ) {
    const path = this.getPath(filename);
    const quality = compressToQuality(compress);

    let imageBuffer: Buffer;
    await catchInvalidImage(async () => {
      imageBuffer = await sharp(path).blur(blur).jpeg({ quality }).toBuffer();
    });

    return imageBuffer;
  }

  // Create blurred image filename
  public getFilename(filename: string) {
    const [filenameWithoutExtension, extension] = filename.split('.');
    return filenameWithoutExtension + '_blurred.' + extension;
  }

  // Create path to filename in the public images folder
  private getPath(filename: string) {
    return path.join(__dirname, '..', '..', '..', 'public', 'images', filename);
  }
}
