/**
 * Описание: Файл содержит роутинг и определения сваггера для модуля пользователей
 */
import { Router } from 'express';

import { asyncWrapper } from '@utils/helpers';
import { authenticate } from 'utils/authentication';
import { UserController } from './user.controller';

/**
 * Роутер: Users
 */
export const createRouter = () => {
  const router = Router();

  /**
	 * Get list of users
	 * @swagger
	 * path:
	 *  /users:
	 *      get:
	 *        tags:
	 *          - Users
	 *        description: Get users
	 *        summary: Get list of users
	 *        produces:
	 *          - application/json
	 *        parameters:
   *          - $ref: '#/components/schemas/paginationPage'
   *          - $ref: '#/components/schemas/paginationSize'
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
	 *                      properties:
	 *                        items:
	 *                          type: array
	 *                          items:
	 *                            $ref: '#/components/schemas/User'
   *                        pagination:
   *                          type: object
   *                          $ref: '#/components/schemas/paginationResponse'
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
  router.get('/', asyncWrapper(UserController.getUsers));

  /**
	 * Get list user by id
	 * @swagger
	 * path:
	 *  /users/{id}:
	 *      get:
	 *        tags:
	 *          - Users
	 *        description: Get user by id
	 *        summary: Get user by id
	 *        security:
	 *          - BearerAuth: []
	 *        produces:
	 *          - application/json
	 *        parameters:
   *          - in: path
   *            name: id
   *            schema:
   *              type: integer
   *            required: true
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
  router.get('/:id', asyncWrapper(authenticate(null)), asyncWrapper(UserController.getUser));

  /**
	 * Create user
	 * @swagger
	 * path:
	 *  /users:
	 *      post:
	 *        tags:
	 *          - Users
	 *        description: Create user
	 *        summary: Create user
	 *        requestBody:
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/CreateUser'
	 *        responses:
	 *          201:
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
  router.post('/', asyncWrapper(UserController.createUser));

  /**
	 * Update user
	 * @swagger
	 * path:
	 *  /users/{id}:
	 *      put:
	 *        tags:
	 *          - Users
	 *        description: Update user
	 *        summary: Update user
	 *        security:
	 *          - BearerAuth: []
	 *        parameters:
	 *          - in: path
	 *            name: id
	 *            schema:
	 *              type: integer
	 *            required: true
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
  router.put('/:id', asyncWrapper(authenticate(null)), asyncWrapper(UserController.updateUser));

  /**
	 * Delete user by id
	 * @swagger
	 * path:
	 *  /users/{id}:
	 *      delete:
	 *        tags:
	 *          - Users
	 *        description: Delete user by id
	 *        summary: Delete user by id
	 *        security:
	 *          - BearerAuth: []
	 *        parameters:
   *          - in: path
   *            name: id
   *            schema:
   *              type: integer
   *            required: true
	 *        responses:
	 *          200:
	 *            description: Successful operation
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
  router.delete('/:id', asyncWrapper(authenticate(null)), asyncWrapper(UserController.deleteUser));

  return router;
};
