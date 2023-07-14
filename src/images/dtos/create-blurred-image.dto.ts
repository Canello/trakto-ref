import { IsUrl, IsNumber, Max, Min } from 'class-validator';

export class CreateBlurredImageDto {
  @IsUrl()
  image: string;

  @IsNumber()
  @Max(0.99)
  @Min(0)
  compress: number;

  @IsNumber()
  @Max(1000)
  @Min(0.3)
  blur: number;
}
