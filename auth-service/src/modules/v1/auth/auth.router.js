/**
 * Описание: Файл содержит роутинг и определения сваггера для модуля авторизации
 */
import { Router } from 'express';

import { asyncWrapper } from '@utils/helpers';
import { AuthController } from './auth.controller';

/**
 * Роутер функционала работы с пользовательской авторизацией
 * @returns {Router}
 */
export const createRouter = () => {
  const router = Router();

  /**
	 * Login
	 * @swagger
	 * path:
	 *  /account/auth/token:
	 *      post:
	 *        tags:
	 *          - Auth
	 *        description: Generate token
	 *        summary: Generate token
	 *        requestBody:
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  email:
	 *                    type: string
	 *                  password:
	 *                    type: string
	 *        responses:
	 *          200:
	 *            description: Successful operation
	 *            content:
	 *              application/json:
	 *                schema:
	 *                  type: object
	 *                  properties:
	 *                    errorCode:
	 *                      type: number
	 *                      example: 0
	 *                    resultData:
	 *                      type: object
	 *                      $ref: '#/components/schemas/AuthType'
	 *          400':
	 *            description: Bad parameters
	 *            content:
	 *              application/json:
	 *                schema:
	 *                  type: object
	 *                  $ref: '#/components/schemas/incorrectParamsResponse'
	 */
  router.post('/token', asyncWrapper(AuthController.login));

  /**
	 * Refresh access token
	 * @swagger
	 * path:
	 *  /account/auth/token:
	 *      put:
	 *        tags:
	 *          - Auth
	 *        description: Generate token using refresh token
	 *        summary: Generate token using refresh token
	 *        requestBody:
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  refreshToken:
	 *                    type: string
	 *        responses:
	 *          200:
	 *            description: Successful operation
	 *            content:
	 *              application/json:
	 *                schema:
	 *                  type: object
	 *                  properties:
	 *                    errorCode:
	 *                      type: number
	 *                      example: 0
	 *                    resultData:
	 *                      type: object
	 *                      $ref: '#/components/schemas/AuthType'
	 *          400':
	 *            description: Bad parameters
	 *            content:
	 *              application/json:
	 *                schema:
	 *                  type: object
	 *                  $ref: '#/components/schemas/unauthorizedResponse'
	 */
  router.put('/token', asyncWrapper(AuthController.refreshToken));

  return router;
};
