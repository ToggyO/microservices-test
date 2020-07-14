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

  // TODO: добавить загрузку файлов
  try {
    await launch({ app });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const { PORT, HOST, NODE_ENV } = config;

  app.listen({ port: PORT, host: HOST }, () => {
    app.get('log').info(`Server running at http://${HOST}:${PORT}, in ${NODE_ENV} mode. `
			+ `Swagger: http://${HOST}:${PORT}${config.API_URL_PREFIX}`);
  });

  return app;
})();

// "indent": [1, "tab"],
