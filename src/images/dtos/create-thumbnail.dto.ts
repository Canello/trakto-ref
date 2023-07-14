import { IsUrl, IsNumber, Max, Min } from 'class-validator';

export class CreateThumbnailDto {
  @IsUrl()
  image: string;

  @IsNumber()
  @Max(0.99)
  @Min(0)
  compress: number;
}
