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
  // eslint-disable-next-line no-unused-expressions
  // await fs.stat(innerDirectory) || await fs.mkdir(innerDirectory);

  await Promise.all(
    files.map(async item => {
      const { originalname, buffer, mimetype } = item;
      const hash = customCrypto.encrypt(new Date().getMilliseconds().toString());
      const file = Buffer.from(buffer.data);
      const qualitySuffix = originalname.includes('360') ? '_360' : '';
      const pathToFile = `${innerDirectory}${hash}${qualitySuffix}`;
      await fs.writeFile(pathToFile, file, { encoding: 'utf8' });
      dbQueries.push({
        hash,
        ownerType,
        pathToFile,
        mimeType: mimetype,
      });
      links.push(`${baseAssetUrl}/source/${ownerType}/${hash}${qualitySuffix}`);
    }),
  );
  // await Models.FileModel.insertMany();
  console.log(dbQueries);
  console.log(links);
  return links;
};

// const {
//   stat,
//   promises
// } = require('fs')
// const {
//   unlink,
//   readdir,
//   mkdir,
//   writeFile: write,
//   readFile: read
// } = promises
//
// module.exports = {
//   clearFolder: async ({ filePath }) => {
//     if (!filePath) {
//       return
//     }
//
//     const files = await readdir(filePath)
//
//     if (files.length) {
//       for (let file of files) {
//         await unlink(filePath + file)
//       }
//     }
//   },
//   readFolder: async ({ filePath }) => {
//     if (!filePath) {
//       return null
//     }
//
//     return await readdir(filePath)
//   },
//   createFolder: async ({ filePath } = {}) => {
//     stat(filePath, async (err, stats) => {
//       if (!stats) {
//         await mkdir(filePath)
//       }
//     })
//   },
//   writeFile: async ({ data, filePath }) => {
//     if (!filePath || !data) {
//       return null
//     }
//
//     await write(filePath, JSON.stringify(data, null, 2))
//   },
//   readFile: async ({ filePath }) => {
//     if (!filePath) {
//       return null
//     }
//
//     const file = await read(filePath, {
//       encoding: `utf-8`
//     })
//
//     return JSON.parse(file)
//   }
// }
