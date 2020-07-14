/**
 * Описание: Корневой обработчик ошибок запросов пользователей
 */
import { ERROR_CODES } from '@constants';
import { log } from './common';
// import * as Sentry from '@sentry/node';
// import config from '/config';

/**
 * Инициализация базового обработчика ошибок, возникающих при пользовательских запросах
 * @param {object} app - экземпляр приложения
 * @returns {void}
 */
export const run = ({ app }) => {
	app.use((err, req, res, next) => { // eslint-disable-line
    // if (config.isProduction && config.SENTRY_DSN) {
    // 	Sentry.captureException(err);
    // }

    if (!err.errorCode) {
      log.error(err);
    }

    if (err.statusCode && err.errorMessage) {
      const {
        statusCode, errorCode, errorMessage, errors = [],
      } = err;
      return res.status(statusCode).send({
        errorCode,
        errorMessage,
        errors,
      });
    }

    res.status(err.statusCode || ERROR_CODES.internal_server_error).send({
      errorCode: err.errorCode || ERROR_CODES.internal_server_error,
      errorMessage: err.errorCode && err.errorCode !== ERROR_CODES.internal_server_error
        ? err.errorMessage : `Внутренняя ошибка сервера: ${err.errorMessage || err.message}`,
      errors: err.errors || [],
    });
  });
};
