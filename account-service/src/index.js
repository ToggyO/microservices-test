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
    process.exit(1);
  }

  const { MIC_ACCOUNT_PORT, MIC_ACCOUNT_HOST, NODE_ENV } = config;

  app.listen({ port: MIC_ACCOUNT_PORT, host: MIC_ACCOUNT_HOST }, () => {
    app.get('log').info(`Server running at http://${MIC_ACCOUNT_HOST}:${MIC_ACCOUNT_PORT}, in ${NODE_ENV} mode. `
			+ `Swagger: http://${MIC_ACCOUNT_HOST}:${MIC_ACCOUNT_PORT}${config.API_URL_PREFIX}`);
  });

  return app;
})();

// "indent": [1, "tab"],
