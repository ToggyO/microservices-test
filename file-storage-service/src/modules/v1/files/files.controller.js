/**
 * Описание: Файл содержит контроллер для обработки роутинга модуля работы с файлами
 */
import path from 'path';
import fs from 'fs';

import { UNPROCESSABLE_ENTITY } from 'constants';
import { getProp } from 'utils/helpers';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { FileService } from './files.service';
import { FILES_ERROR_MESSAGES } from './contansts';

export const FileController = {};

/**
 * Получить файл по ссылке
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
FileController.getFile = async (req, res, next) => {
  try {
    const pathname = getProp(req.params, '0', null);
    const splittedPathname = pathname.split('/');

    const queries = splittedPathname.reverse().reduce((acc, curr, index) => {
      let key = null;
      switch (index) {
        case 0:
          return {
            ...acc,
            hash: curr,
          };
        case 1:
          if (splittedPathname.length > 2) {
            key = 'subDir';
          } else {
            key = 'ownerType';
          }
          return {
            ...acc,
            [key]: curr,
          };
        case 2:
          return {
            ...acc,
            ownerType: curr,
          };
        default:
          return acc;
      }
    }, {});

    if (!queries.hash) {
      res.status(404).end();
    }

    const { pathToFile, mimeType } = await FileService.getFileData({ conditions: { hash: queries.hash } });

    if (!pathToFile || !mimeType) {
      return res.status(404).end();
    }

    let resultPath = null;

    if (queries.subDir) {
      const indexOfHash = pathToFile.indexOf(queries.hash);
      const splitted = pathToFile.substr(0, indexOfHash);
      resultPath = `${splitted}${queries.subDir}/${queries.hash}`;
    } else {
      resultPath = pathToFile;
    }

    const file = path.join(process.cwd(), resultPath);
    const stream = fs.createReadStream(file);

    res.set('Content-Type', mimeType);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Загрузить и сохранить файл
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
FileController.saveFile = async (req, res, next) => {
  try {
    const files = getProp(req.body, 'files', null);
    const ownerType = getProp(req.body, 'ownerType', null);

    if (!files || !Object.keys(files).length) {
      throw new ApplicationError({
        statusCode: 422,
        errorMessage: FILES_ERROR_MESSAGES.NO_FILES,
        errorCode: UNPROCESSABLE_ENTITY,
        errors: [],
      });
    }

    if (!ownerType) {
      throw new ApplicationError({
        statusCode: 422,
        errorMessage: FILES_ERROR_MESSAGES.NO_OWNER_TYPE,
        errorCode: UNPROCESSABLE_ENTITY,
        errors: [],
      });
    }

    const resultData = await FileService.saveFileData({ files, ownerType });

    res.status(201).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};
