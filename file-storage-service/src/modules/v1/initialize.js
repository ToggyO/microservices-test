/**
 * Описание: Глобальная инициализация 1-й версии API
 */
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import config from 'config';
import { getAppBaseUrl } from 'utils/helpers';
// инициализаторы роутинга
import { CreateRouter as CreateFilesRouter } from './files/files.router';
// инициализаторы моделей

/**
 * Инициализация роутинга
 * @returns {Router}
 */
export const createV1Router = () => {
  const router = Router();

  router.use('/', new CreateFilesRouter().initRoutes());

  return router;
};

/**
 * Инициализация сваггера
 * @param {string} basePath
 */
export const initializeSwagger = ({ basePath = '' }) => {
  const {
    isProduction,
  } = config;

  const modulesSwaggerSchemes = {
    /* eslint-disable global-require */

    /* eslint-enable global-require */
  };

  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Microservices-test files service API',
        version: '1.0',
        description: 'API Documentation',
      },
      basePath,
      servers: [
        {
          // url: isProduction
          //   ? `http://${config.NGINX_HOST}:${config.NGINX_PORT}${basePath}`
          //   : `http://${config.MIC_FILES_HOST}:${config.MIC_FILES_PORT}${basePath}`,
          url: getAppBaseUrl(),
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
