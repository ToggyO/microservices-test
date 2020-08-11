/**
 * Описание: Файл содержит сервис для модуля работы с файлами
 */
import { promises as fs } from 'fs';

import config from 'config';
import { db } from 'db';
import { customCrypto, getAppBaseUrl } from 'utils/helpers';

const { Models } = db;

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
  Models.FileModel.findOne(conditions, projection, options)
);

FileService.saveFileData = async ({ files, ownerType }) => {
  const dbQueries = [];
  const links = [];
  const innerDirectory = `.${config.TEMP_DIR}${ownerType}/`;
  const baseAssetUrl = getAppBaseUrl();

  try {
    await fs.stat(innerDirectory);
  } catch (error) {
    await fs.mkdir(innerDirectory);
  }

  await Promise.all(
    files.map(async item => {
      const { originalname, buffer, mimetype } = item;
      const hash = customCrypto.encrypt(new Date().getMilliseconds().toString());
      const file = Buffer.from(buffer.data);

      let qualitySuffix;

      if (mimetype.includes('image')) {
        qualitySuffix = originalname.includes('360') ? '360' : '';
        try {
          await fs.stat(`${innerDirectory}/${qualitySuffix}`);
        } catch (error) {
          await fs.mkdir(`${innerDirectory}/${qualitySuffix}`);
        }
      }

      const pathToFile = `${innerDirectory}${qualitySuffix ? `/${qualitySuffix}` : ''}${hash}_${qualitySuffix}`;
      await fs.writeFile(pathToFile, file, { encoding: 'utf8' });
      dbQueries.push({
        hash,
        ownerType,
        pathToFile,
        mimeType: mimetype,
      });
      // links.push(`${baseAssetUrl}/source/${ownerType}/${hash}${qualitySuffix}`);
    }),
  );
  // await Models.FileModel.insertMany();
  console.log(dbQueries);
  console.log(links);
  return dbQueries;
};
