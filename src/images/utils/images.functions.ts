import { BadRequestException } from '@nestjs/common';

// Transforms compression rate into quality rate
export const compressToQuality = (compress: number) => {
  return Math.floor((1 - compress) * 100);
};

// Handle errors due to invalid images
export const catchInvalidImage = async (func: Function) => {
  try {
    await func();
  } catch (err) {
    // console.log(err);
    throw new BadRequestException('Imagem inválida.');
  }
};
