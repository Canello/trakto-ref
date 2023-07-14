const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
import { Injectable, BadRequestException } from '@nestjs/common';
import { catchInvalidImage } from '../utils/images.functions';

@Injectable()
export class ImagesRepository {
  public async getMetadata(filename: string) {
    const path = this.getPath(filename);

    let metadata: any;
    try {
      metadata = await sharp(path).metadata();
    } catch (err) {
      throw new BadRequestException('Imagem inválida.');
    }

    return metadata;
  }

  // Save image buffer as image file into file system
  public async save(filename: string, imageBuffer: Buffer) {
    const newPath = this.getPath(filename);

    await catchInvalidImage(async () => {
      await sharp(imageBuffer).toFile(newPath);
    });
  }

  // Download image from url into file system
  public async downloadFrom(url: string) {
    const filename = uuidv4() + '.jpeg';
    const path = this.getPath(filename);

    await catchInvalidImage(async () => {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, Buffer.from(response.data), 'binary');
    });

    return filename;
  }

  // Create path to filename in the public/images folder
  private getPath(filename: string) {
    return path.join(__dirname, '..', '..', '..', 'public', 'images', filename);
  }
}
