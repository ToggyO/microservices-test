/**
 * Описание: Файл содержит роутинг и определения сваггера для модуля текущекого пользователя
 */
import { Router } from 'express';

import { asyncWrapper, upload } from '@utils/helpers';
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
   *  /account/profile/me:
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
   *  /account/profile/me:
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

  // FIXME: работать ответы в сваггере
  /**
   * Upload user's avatar
   * @swagger
   * path:
   *  /account/profile/avatar:
   *      post:
   *        tags:
   *          - Profile
   *        description: Upload user's avatar
   *        summary: Upload user's avatar
   *        security:
   *          - BearerAuth: []
   *        requestBody:
   *          content:
   *            multipart/form-data:
   *              schema:
   *                type: object
   *                properties:
   *                  files:
   *                    type: string
   *                    format: binary
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
   */
  router.post(
    '/avatar',
    asyncWrapper(authenticate(null)),
    upload.array('files', 8),
    // upload.single('file'),
    asyncWrapper(ProfileController.uploadAvatar),
  );

  return router;
};
