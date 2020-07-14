/**
 * Описание: Файл содержит роутинг и определения сваггера для модуля текущекого пользователя
 */
import { Router } from 'express';

import { asyncWrapper } from '@utils/helpers';
import { authenticate } from 'utils/authentication';
import { ProfileController } from './profile.controller';

/**
 * Роутер: Profile
 */

export const createRouter = () => {
  const router = Router();

  /**
   * Get profile of the current user
   * @swagger
   * path:
   *  /profile/me:
   *      get:
   *        tags:
   *          - Profile
   *        description: Get profile of the current user
   *        summary: Get profile of the current user
   *        security:
   *          - BearerAuth: []
   *        produces:
   *          - application/json
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
   *                      $ref: '#/components/schemas/User'
   *          401:
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  $ref: '#/components/schemas/unauthorizedResponse'
   *          403:
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  $ref: '#/components/schemas/forbiddenResponse'
   *          404:
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  $ref: '#/components/schemas/notFoundResponse'
   */
  router.get('/me', asyncWrapper(authenticate(null)), asyncWrapper(ProfileController.getCurrentUserProfile));

  /**
   * Update current user
   * @swagger
   * path:
   *  /profile/me:
   *      put:
   *        tags:
   *          - Profile
   *        description: Update current user
   *        summary: Update current user
   *        security:
   *          - BearerAuth: []
   *        requestBody:
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UpdateUser'
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
   *                      $ref: '#/components/schemas/User'
   *          400':
   *            description: Bad parameters
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  $ref: '#/components/schemas/incorrectParamsResponse'
   *          401:
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  $ref: '#/components/schemas/unauthorizedResponse'
   *          403:
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  $ref: '#/components/schemas/forbiddenResponse'
   */
  router.put('/me', asyncWrapper(authenticate(null)), asyncWrapper(ProfileController.updateCurrentUserProfile));

  return router;
};
