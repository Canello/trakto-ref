import { Metadata } from '../data-storage/metadata.entity';

export const makeMockImagesRepository = () => {
  return {
    save: () => 'some-filename.jpeg',
    getMetadata: () => {
      return { width: 1000, height: 900 };
    },
    downloadFrom: () => 'some-filename.jpeg',
  };
};

export const makeMockMetadataRepository = () => {
  return {
    create({ image, compress }: { image: string; compress: number }) {
      return { image, compress };
    },
    save(newMetadata: Partial<Metadata>) {
      return Promise.resolve(newMetadata);
    },
  };
};

export const makeMockThumbnailService = () => {
  return {
    generate: () => Buffer.from('abc'),
    getFilename: (filename: string) => {
      const [filenameWithoutExtension, extension] = filename.split('.');
      return filenameWithoutExtension + '_thumb.' + extension;
    },
  };
};

export const makeMockBlurService = () => {
  return {
    generate: () => Buffer.from('abc'),
    getFilename: (filename: string) => {
      const [filenameWithoutExtension, extension] = filename.split('.');
      return filenameWithoutExtension + '_blurred.' + extension;
    },
  };
};
