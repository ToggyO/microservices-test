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
    const hash = getProp(req.params, 'hash', null);
    const ownerType = getProp(req.ownerType, 'hash', null);
    if (!hash || !ownerType) {
      res.status(404).end();
    }

    const { pathToFile, mimeType } = await FileService.getFileData({ conditions: { hash, ownerType } });

    if (!pathToFile || !mimeType) {
      return res.status(404).end();
    }

    const file = path.join(process.cwd(), pathToFile);
    const stream = fs.createReadStream(file);

    res.set('Content-Type', mimeType);
    stream.pipe(res);

    // stream.on('open', () => {
    //   res.set('Content-Type', mimeType);
    //   stream.pipe(res);
    // });
    //
    // stream.on('error', () => {
    //   res.set('Content-Type', 'text/plain');
    //   res.status(404).end();
    // });
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
