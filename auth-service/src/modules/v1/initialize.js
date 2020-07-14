/**
 * Описание: Глобальная инициализация 1-й версии API
 */
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import config from '@config';
import { ERROR_CODES } from '@constants';
// инициализаторы роутинга
import { createRouter as createAuthRouter } from './auth/auth.router';
import { createRouter as createUserRouter } from './user/user.router';
import { createRouter as createProfileRouter } from './profile/profile.router';
// инициализаторы моделей
import { initializeModel as initializeUserModel } from './user/user.model';
import { initializeModel as initializeAuthModel } from './auth/auth.model';

/**
 * Инициализация роутинга
 * @returns {Router}
 */
export const createV1Router = () => {
  const router = Router();

  router.use('/users', createUserRouter());
  router.use('/auth', createAuthRouter());
  router.use('/profile', createProfileRouter());

  return router;
};

/**
 * Инициализация моделей
 * @param app
 * @returns {void}
 */
export const initializeModels = ({ app } = {}) => {
  const models = {};

  models.UserModel = initializeUserModel();
  models.AuthModel = initializeAuthModel();

  Object.keys(models).forEach((modelKey) => {
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
  const { isProduction } = config;

  const modulesSwaggerSchemes = {
    /* eslint-disable global-require */
    ...require('./auth/swagger.json').schemas,
    ...require('./user/swagger.json').schemas,
    /* eslint-enable global-require */
  };

  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Sequelize test API',
        version: '1.0',
        description: 'API Documentation',
      },
      basePath,
      servers: [
        {
          url: `http://${config.HOST}:${config.PORT}`,
          description: `${isProduction ? 'Production' : 'Local'} server`,
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          ...modulesSwaggerSchemes,
          paginationPage: {
            in: 'query',
            name: 'page',
            description: 'Page number',
            required: false,
            schema: {
              type: 'integer',
              minimum: 0,
              // default: 0,
            },
          },
          paginationSize: {
            in: 'query',
            name: 'pageSize',
            description: 'Items per page',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              // default: 10,
            },
          },
          paginationResponse: {
            type: 'object',
            properties: {
              page: {
                type: 'number',
              },
              pageSize: {
                type: 'number',
              },
              total: {
                type: 'number',
              },
            },
          },
          unauthorizedResponse: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              errorCode: { type: 'number', example: ERROR_CODES.security__invalid_token_error },
              errorMessage: { type: 'string' },
            },
          },
          incorrectParamsResponse: {
            description: 'Invalid income parameters format',
            type: 'object',
            properties: {
              errorCode: { type: 'number', example: ERROR_CODES.validation },
              errorMessage: { type: 'string' },
              errors: { items: { type: 'string' } },
            },
          },
          forbiddenResponse: {
            description: 'Permission denied',
            type: 'object',
            properties: {
              errorCode: { type: 'number', example: ERROR_CODES.security__no_permissions },
              errorMessage: { type: 'string' },
            },
          },
          notAcceptableResponse: {
            description: 'Request cannot be completed',
            type: 'object',
            properties: {
              errorCode: { type: 'number', example: ERROR_CODES.notAcceptable },
              errorMessage: { type: 'string' },
            },
          },
          notFoundResponse: {
            description: 'Not found',
            type: 'object',
            properties: {
              errorCode: { type: 'number', example: ERROR_CODES.not_found },
              errorMessage: { type: 'string' },
            },
          },
        },
      },
    },
    apis: [`${process.cwd()}/src/modules/v1/*/*.router.js`],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  return swaggerUi.setup(swaggerSpec);
};
