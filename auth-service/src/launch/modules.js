/**
 * Описание: Глобальный роутинг приложения по версиям и инициализация моделей
 */
import swaggerUi from 'swagger-ui-express';
import expressFileupload from 'express-fileupload';

import config from '@config';
import {
  createV1Router,
  initializeSwagger,
  initializeModels as initializeV1Models,
} from '@modules/v1/initialize';

/**
 * Инициализация моделей и роутинга для различных версий приложения
 * @param {object} app - экземпляр приложения
 * @returns {void}
 */
export const run = ({ app }) => {
  initializeV1Models({ app });
  // FIXME: проверить необъходимость
  app.use(expressFileupload({
    limits: { files: 1, fileSize: 1024 * 1024 * Number(config.UPLOAD_MAX_FILESIZE_MB) },
    useTempFiles: true,
    tempFileDir: config.TEMP_DIR,
  }));
  app.use('/', createV1Router());
  app.use(config.API_URL_PREFIX, swaggerUi.serve, initializeSwagger({ basePath: '/' }));
};
