/**
 * Описание: Файл содержит функцию для работы с входящими изображениями
 */

import sharp from 'sharp';

import { getFileExtension } from './common';

/**
 * Обработка входящих изображений и создание разноразмерных копий
 * @param {object} image - изображение
 * @param {Array<string>} sizes - разрешения, для которых необходимо создать копии
 * @returns {void}
 */
export const imageProcessing = async (image, sizes) => {
  const clonedImage = { ...image };
  const file = Buffer.from(clonedImage.buffer.data);
  const processedOriginalBuffer = await sharp(file)
    .jpeg({
      quality: 100,
      force: false,
    })
    .png({
      quality: 100,
      force: false,
    })
    .toBuffer();

  const images = {
    originalFile: {
      ...clonedImage,
      buffer: processedOriginalBuffer,
    },
  };

  await Promise.all(
    sizes.map(async size => {
      const resizedBuffer = await sharp(file)
        .resize({
          width: parseInt(size, 10),
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();

      const [fileName, fileExt] = getFileExtension(image.originalname);

      const resized = {
        ...clonedImage,
        originalname: `${fileName}_${size}.${fileExt}`,
        buffer: resizedBuffer,
        size: resizedBuffer.length,
      };

      images[size] = resized;
    }),
  );

  return images;
};

/**
 * Получений обработанных изображений
 * @param {Array<object> | object} assets - массив изображений или единственное изображение
 * @param {Array<string>} sizes - разрешения, для которых необходимо создать копии
 * @returns {void}
 */
export const getProcessedImages = async (assets, sizes = []) => {
  const withResizedImages = [];

  if (Array.isArray(assets)) {
    await Promise.all(
      assets.map(async currImage => {
        const clonedImage = await imageProcessing(currImage, sizes);

        withResizedImages.push(clonedImage);
      }),
    );

    return withResizedImages;
  }

  const clonedImage = await imageProcessing(assets, sizes);

  withResizedImages.push(clonedImage);

  return withResizedImages;
};
