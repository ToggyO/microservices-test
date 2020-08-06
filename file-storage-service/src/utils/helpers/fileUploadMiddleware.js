/**
 * Описание: Файл содержит функцию для обработки входящих файлов
 */
import multer from 'multer';

import config from 'config';
import { customCrypto } from './crypto';

/**
 * See https://github.com/expressjs/multer
 */
const uploadOptions = {
  storage: multer.diskStorage({
    destination: config.TEMP_DIR,
    filename: (req, file, cb) => {
      const fileName = customCrypto.encrypt(new Date().getMilliseconds().toString());
      console.log(fileName);
      cb(null, fileName);
    },
  }),
};

export const upload = multer(uploadOptions);
