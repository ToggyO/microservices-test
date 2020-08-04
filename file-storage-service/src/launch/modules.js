// TODO: cut express-fileupload from deps
/**
 * Описание: Глобальный роутинг приложения по версиям и инициализация моделей
 */
import swaggerUi from 'swagger-ui-express';

import config from 'config';
import { upload } from 'utils/helpers';
import {
  createV1Router,
  initializeSwagger,
} from 'modules/v1/initialize';

/**
 * Инициализация обработчика файлов, роутинга, сваггера для различных версий приложения
 * @param {object} app - экземпляр приложения
 * @returns {void}
 */
export const run = ({ app }) => {
  // app.use(expressFileupload({
  //   limits: { files: 1, fileSize: 1024 * 1024 * Number(config.UPLOAD_MAX_FILESIZE_MB) },
  //   useTempFiles: true,
  //   tempFileDir: config.TEMP_DIR,
  // }));
  app.use(upload.array('files', Number(config.UPLOAD_MAX_FILES_COUNT)));
  // app.use(upload.single('files'));
  app.use(config.MIC_FILES_ROUTE_PREFIX, createV1Router());
  app.use(config.API_URL_PREFIX, swaggerUi.serve, initializeSwagger({ basePath: '/' }));
};
