/**
 * Описание: Файл содержит контроллер для обработки роутинга модуля работы с файлами
 */
import path from 'path';
import fs from 'fs';

import { UNPROCESSABLE_ENTITY, ERROR_CODES } from 'constants';
import { getProp, parseFileRequestURL } from 'utils/helpers';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { FileService } from './files.service';
import { FILES_ERROR_MESSAGES } from './contansts';

export const FileController = {};

const businessErrorPayload = (errorMessage) => ({
  statusCode: 422,
  errorMessage,
  errorCode: UNPROCESSABLE_ENTITY,
  errors: [],
});

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

    const queries = parseFileRequestURL(pathname);

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
    const oldHash = getProp(req.body, 'oldHash', null);

    if (!files || !Object.keys(files).length) {
      throw new ApplicationError(
        businessErrorPayload(FILES_ERROR_MESSAGES.NO_FILES),
      );
    }

    if (!ownerType) {
      throw new ApplicationError(
        businessErrorPayload(FILES_ERROR_MESSAGES.NO_OWNER_TYPE),
      );
    }

    const resultData = await FileService.saveFileData({ files, ownerType, oldHash });

    res.status(201).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить файл
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
FileController.deleteFile = async (req, res, next) => {
  try {
    const hash = getProp(req.body, 'fileName', null);
    const resolutions = getProp(req.body, 'resolutions', []);

    if (!hash) {
      throw new ApplicationError({
        statusCode: 404,
        errorMessage: FILES_ERROR_MESSAGES.NOT_FOUND,
        errorCode: ERROR_CODES.not_found,
        errors: [],
      });
    }

    const resultData = await FileService.deleteFile({ hash, resolutions });

    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};
