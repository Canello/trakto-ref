import { Body, Controller, Post } from '@nestjs/common';
import { CreateThumbnailDto } from 'src/images/dtos/create-thumbnail.dto';
import { ImagesService } from './images.service';
import { CreateBlurredImageDto } from './dtos/create-blurred-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('thumbnail')
  createThumbnail(@Body() body: CreateThumbnailDto) {
    return this.imagesService.createThumbnail(body);
  }

  @Post('blur')
  createFilteredImage(@Body() body: CreateBlurredImageDto) {
    return this.imagesService.createBlurredImage(body);
  }
}
