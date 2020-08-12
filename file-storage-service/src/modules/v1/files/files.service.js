/**
 * Описание: Файл содержит сервис для модуля работы с файлами
 */
import { promises as fs } from 'fs';

import config from 'config';
import { db } from 'db';
import { customCrypto, imageProcessing } from 'utils/helpers';

export const FileService = {};

/**
 * Получить файл по хэш-идентификатору
 * @param {object} conditions
 * @param {object} projection
 * @param {object} options
 * @returns {Promise<object>}
 */
FileService.getFileData = async ({
  conditions = {},
  projection = {},
  options = {},
}) => (
  db.Models.FileModel.findOne(conditions, projection, options)
);

FileService.saveFileData = async ({ files, ownerType }) => {
  const dbQueries = [];
  const innerDirectory = `.${config.TEMP_DIR}${ownerType}/`;

  try {
    await fs.stat(innerDirectory);
  } catch (error) {
    await fs.mkdir(innerDirectory);
  }

  await Promise.all(
    files.map(async item => {
      const { buffer, mimetype } = item;
      const hash = customCrypto.encrypt(new Date().getMilliseconds().toString());
      let pathToFile = null;

      if (mimetype.includes('image')) {
        const processedImages = await imageProcessing(item, config.RESIZE_RESOLUTION_LIST);

        await Promise.all(
          Object.entries(processedImages).map(async ([quality, image]) => {
            const isOrigin = quality === 'originalFile';

            if (!isOrigin) {
              try {
                await fs.stat(`${innerDirectory}/${quality}`);
              } catch (error) {
                await fs.mkdir(`${innerDirectory}/${quality}`);
              }
            }

            const path = `${innerDirectory}${!isOrigin ? `${quality}/` : ''}${hash}`;
            if (isOrigin) {
              pathToFile = path;
            }

            await fs.writeFile(path, image.buffer, { encoding: 'utf8' });
          }),
        );
      } else {
        const file = Buffer.from(buffer.data);
        pathToFile = `${innerDirectory}${hash}`;
        await fs.writeFile(pathToFile, file, { encoding: 'utf8' });
      }

      dbQueries.push({
        hash,
        ownerType,
        pathToFile,
        mimeType: mimetype,
      });
    }),
  );

  await db.Models.FileModel.insertMany(dbQueries);

  return dbQueries;
};
