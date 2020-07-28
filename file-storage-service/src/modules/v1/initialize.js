/**
 * Описание: Глобальная инициализация 1-й версии API
 */
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import config from 'config';
import { ERROR_CODES } from 'constants';
// инициализаторы роутинга

// инициализаторы моделей

/**
 * Инициализация роутинга
 * @returns {Router}
 */
export const createV1Router = () => {
  const router = Router();

  return router;
};

/**
 * Инициализация моделей
 * @param app
 * @returns {void}
 */
export const initializeModels = ({ app }) => {
  const models = {};

  Object.keys(models).forEach(modelKey => {
    // Обратный вызов модели на событии полной готовности всех доступных моделей
    try {
      if (typeof models[modelKey].onAllModelsInitialized === 'function') {
        models[modelKey].onAllModelsInitialized(models);
      }
    } catch (error) {
      app.get('log').error(error);
    }
  });
};

/**
 * Инициализация сваггера
 * @param {string} basePath
 */
export const initializeSwagger = ({ basePath }) => {
  const {
    isProduction
  } = config;

  const modulesSwaggerSchemes = {
    /* eslint-disable global-require */

    /* eslint-enable global-require */
  };

  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Microservices-test account service API',
        version: '1.0',
        description: 'API Documentation',
      },
      basePath,
      servers: [
        {
          url: isProduction
            ? `http://${config.NGINX_HOST}:${config.NGINX_PORT}`
            : `http://${config.MIC_FILES_HOST}:${config.MIC_FILES_PORT}`,
          description: `${isProduction ? 'Production' : 'Local'} server`,
        },
      ],
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {},
    },
    apis: [`${process.cwd()}/src/modules/v1/*/*.router.js`],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  return swaggerUi.setup(swaggerSpec);
};
