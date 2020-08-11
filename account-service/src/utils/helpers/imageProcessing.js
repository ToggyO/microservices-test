/**
 * Описание: Файл содержит функцию для работы с входящими изображениями
 */

import sharp from 'sharp';

import { getFileExtension } from './common';

/**
 * Инициализация базового обработчика ошибок, возникающих при пользовательских запросах
 * @param {object} image - картинка
 * @param {Array<string>} sizes - разрешения, для которых необходимо создать картинки
 * @returns {void}
 */
const imageProcessing = async (image, sizes = []) => {
  const clonedImage = { ...image };
  const images = {
    originalFile: image,
  };

  await Promise.all(
    sizes.map(async size => {
      const resizedBuffer = await sharp(clonedImage.buffer)
        .resize({
          width: 360,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();

      const [fileName, fileExt] = getFileExtension(image.originalname);

      const resized = {
        ...clonedImage,
        originalname: `${fileName}_360.${fileExt}`,
        buffer: resizedBuffer,
        size: resizedBuffer.length,
      };

      images[size] = resized;
    }),
  );
  // const resized = await sharp(clonedImage.buffer)
  //   .resize({
  //     width: 360,
  //     fit: sharp.fit.inside,
  //     withoutEnlargement: true,
  //   })
  //   .toBuffer();

  // const [fileName, fileExt] = getFileExtension(image.originalname);
  //
  // clonedImage.originalname = `${fileName}_360.${fileExt}`;
  // clonedImage.buffer = resized;
  // clonedImage.size = resized.length;

  return images;
};


export const getResizedImage = async assets => {
  const withResizedImages = [];

  if (Array.isArray(assets)) {
    await Promise.all(
      assets.map(async currImage => {
        const clonedImage = await imageProcessing(currImage, ['360']);

        // withResizedImages.push(currImage);
        withResizedImages.push(clonedImage);
      }),
    );

    return withResizedImages;
  }

  const clonedImage = await imageProcessing(assets);

  // withResizedImages.push(assets);
  withResizedImages.push(clonedImage);

  return withResizedImages;
};
