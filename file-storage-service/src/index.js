/**
 * Описание: Корневой файл приложения
 */
import express from 'express';

import config from './config';
import launch from './launch';

/**
 * Функция инициализирующая приложения
 * @returns {function}
 */
export const init = (async () => {
  const app = express();

  try {
    await launch({ app });
  } catch (error) {
    console.log(error);
    console.log('init catch block');
    process.exit(1);
  }

  const { NODE_ENV, MIC_FILES_HOST, MIC_FILES_PORT } = config;

  app.listen({ port: MIC_FILES_PORT, host: MIC_FILES_HOST }, () => {
    app.get('log').info(`Server running at http://${MIC_FILES_HOST}:${MIC_FILES_PORT}, in ${NODE_ENV} mode. `
      + `Swagger: http://${MIC_FILES_HOST}:${MIC_FILES_PORT}${config.API_URL_PREFIX}`);
  });

  return app;
})();
