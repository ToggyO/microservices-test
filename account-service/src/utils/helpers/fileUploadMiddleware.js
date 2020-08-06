/**
 * Описание: Файл содержит функцию для обработки входящих файлов
 */
import multer from 'multer';

import config from '@config';
import { SUPPORTED_MIME_TYPES } from '@constants';

/**
 * See https://github.com/expressjs/multer
 */
const uploadOptions = {
  fileFilter: (req, file, cb) => {
    const allowedFileType = SUPPORTED_MIME_TYPES[file.mimetype];

    if (!allowedFileType) {
      return cb(null, false);
    }

    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * Number(config.UPLOAD_MAX_FILESIZE_MB),
  },
};

export const upload = multer(uploadOptions);
