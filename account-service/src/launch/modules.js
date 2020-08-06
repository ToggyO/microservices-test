/**
 * Описание: Глобальный роутинг приложения по версиям и инициализация моделей
 */
import swaggerUi from 'swagger-ui-express';

import config from '@config';
// import { upload } from '@utils/helpers';
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
  // app.use(upload.array('files', Number(config.UPLOAD_MAX_FILES_COUNT)));
  app.use(config.MIC_ACCOUNT_ROUTE_PREFIX, createV1Router());
  app.use(config.API_URL_PREFIX, swaggerUi.serve, initializeSwagger({ basePath: '/' }));
};
