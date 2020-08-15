/**
 * Описание: Глобальная инициализация 1-й версии API
 */
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import config from '@config';
import { getAppBaseUrl } from '@utils/helpers';
import { ERROR_CODES, UNPROCESSABLE_ENTITY } from '@constants';
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
  const {
    isProduction,
  } = config;

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
        title: 'Microservices-test account service API',
        version: '1.0',
        description: 'API Documentation',
      },
      basePath,
      servers: [
        {
          // url: isProduction
          //   ? `http://${config.NGINX_HOST}:${config.NGINX_PORT}`
          //   : `http://${config.MIC_ACCOUNT_HOST}:${config.MIC_ACCOUNT_PORT}`,
          url: getAppBaseUrl(),
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
          sort: {
            in: 'query',
            name: 'sort',
            description: 'Sorter rules: asc sorting - `{fieldName}`, desc sorting - `!{fieldName}`',
            required: false,
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          filter: {
            in: 'query',
            name: 'filter',
            description: 'Filter (accepted operators: eq, neq, nnull, in, lk, sw, ew, gt, lt, lte).'
              + ' Example: `field eq value` \n'
              + 'By default all filters are used with AND operator. \n'
              + 'Use "$" before field name to apply OR operator.'
              + ' Example of usage by two columns: '
              + '`filter=$name lk %substring%&filter=$organizationName lk %substring%`',
            required: false,
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
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
          unprocessableEntityResponse: {
            description: 'Unprocessable entity',
            type: 'object',
            properties: {
              errorCode: { type: 'number', example: UNPROCESSABLE_ENTITY },
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
