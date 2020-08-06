/**
 * Описание: Файл содержит контроллер для обработки роутинга модуля работы с файлами
 */
import path from 'path';
import { promises as fs } from 'fs';

import config from 'config';
import { UNPROCESSABLE_ENTITY } from 'constants';
import { getProp } from 'utils/helpers';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { FileService } from './files.service';
import { FILES_ERROR_MESSAGES } from './contansts';

export const FileController = {};

// const

/**
 * Получить файл по ссылке
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
FileController.getFile = async (req, res, next) => {
  try {
    const hash = getProp('hash', req.params, null);
    if (!hash) {
      res.status(404).end();
    }

    const { pathToFile, mimeType } = await FileService.getFileData({ conditions: { hash } });

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

    if (!files || !Object.keys(files).length) {
      throw new ApplicationError({
        statusCode: 422,
        errorMessage: FILES_ERROR_MESSAGES.NO_FILES,
        errorCode: UNPROCESSABLE_ENTITY,
        errors: [],
      });
    }

    // const resultData = FileService.saveFileData();
    await Promise.all(
      files.map(async item => {
        const string = Buffer.from(item.buffer.data);
        await fs.writeFile(`.${config.TEMP_DIR}${item.originalname}`, string, { encoding: 'utf8' });
      }),
    );

    res.status(201).send(getSuccessRes({}));
  } catch (error) {
    next(error);
  }
};
