/**
 * Описание: Файл содержит функцию для работы с входящими изображениями
 */

import sharp from 'sharp';

import { getFileExtension } from './common';

export const imageProcessing = async (image) => {
  const withResizedImages = [];
  await Promise.all(
    image.map(async currImage => {
      const clonedImage = { ...currImage };

      const resized = await sharp(clonedImage.buffer)
        .resize({
          width: 360,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();

      const [fileName, fileExt] = getFileExtension(currImage.originalname);

      clonedImage.originalname = `${fileName}_360.${fileExt}`;
      clonedImage.buffer = resized;
      clonedImage.size = resized.length;

      withResizedImages.push(currImage);
      withResizedImages.push(clonedImage);
    }),
  );

  return withResizedImages;
};
