/**
 * Описание: Файл содержит сервис для модуля работы с файлами
 */
import { promises as fs } from 'fs';

import config from 'config';
import { db } from 'db';
import { ERROR_CODES } from 'constants';
import { customCrypto, imageProcessing } from 'utils/helpers';
import { ApplicationError } from 'utils/response';
import { FILES_ERROR_MESSAGES } from './contansts';

export const FileService = {};

const notFoundErrorPayload = {
  statusCode: 404,
  errorMessage: FILES_ERROR_MESSAGES.NOT_FOUND,
  errorCode: ERROR_CODES.not_found,
  errors: [],
};

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

/**
 * Записать (или перезаписать) файл в базу данных и в файловую систему
 * @param {Array<object>} files
 * @param {string} ownerType
 * @param {string} oldHash
 * @returns {Promise<object>}
 */
FileService.saveFileData = async ({ files, ownerType, oldHash }) => {
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
            const isOrigin = quality === 'originalFile' || quality === 'fileName';

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

  if (oldHash) {
    await db.Models.FileModel.deleteMany({ hash: oldHash });
  }

  return dbQueries;
};

/**
 * Удалить файл из базы данных и из файлового хранилища
 * @param {string} hash
 * @param {Array<string | number>} resolutions - только для изображений
 * @returns {Promise<object>}
 */
FileService.deleteFile = async ({ hash, resolutions }) => {
  const file = await FileService.getFileData({ conditions: { hash } });

  if (!file) {
    throw new ApplicationError(notFoundErrorPayload);
  }

  const { pathToFile } = file;

  try {
    await fs.unlink(pathToFile);

    if (resolutions.length) {
      const indexOfHash = pathToFile.indexOf(hash);
      const splitted = pathToFile.substr(0, indexOfHash);

      await Promise.all(
        resolutions.map(async resolution => {
          const path = `${splitted}${resolution}/${hash}`;
          await fs.unlink(path);
        }),
      );
    }
  } catch (error) {
    throw new ApplicationError(notFoundErrorPayload);
  }

  const deletedFile = await db.Models.FileModel.findOneAndDelete({ hash });

  return deletedFile;
};
