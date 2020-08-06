/**
 * Описание: Конфигурация основных настроек сервера
 */
import path from 'path';
import bodyParser from 'body-parser';

import logger from 'utils/logger';
import config from 'config';
import pack from '../../package.json';

/**
 * Поиск необработанных ошибок
 * @param {object} app - экземпляр приложения
 * @returns {void}
 */
function unhandledRejection({ app }) {
  const log = app.get('log');
  const unhandledRejections = [];
  // const { isProduction } = config;

  // if (isProduction && SENTRY_DSN) {
  //   Sentry.init({ dsn: `${SENTRY_DSN}` }); // Логирование ошибок с помощью sentry.io
  // }

  process.on('unhandledRejection', (reason, promise) => {
    const errorMessageContent = `${reason.stack || reason}`;
    const errorMsg = errorMessageContent.replace(/(\r\n|\n|\r)|(\s{2,})/gm, ' ');
    log.warn(errorMsg);
    unhandledRejections.push(promise); // or Promise.reject(new Error())
  });

  process.on('rejectionHandled', promise => {
    const index = unhandledRejections.indexOf(promise);
    unhandledRejections.splice(index, 1);
  });
}

export const log = logger({
  mode: config.NODE_ENV,
  app: {
    name: pack.name,
    version: pack.version,
  }
});

/**
 * Инициализация базовых промежуточных обработчиков
 * @param {object} app - экземпляр приложения
 * @returns {void}
 */
export const run = ({ app }) => {
  // подключение логирования к приложению
  app.set('log', log);
  // Парсинг данных запроса
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // Обработка глобальных необработанных ошибок
  unhandledRejection({ app });
};
