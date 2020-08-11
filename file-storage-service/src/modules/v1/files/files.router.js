/**
 * Описание: Файл содержит роутинг и определения сваггера для модуля работы с файлами
 */
// TODO: пересмотреть ответы в описании сваггера
import { Router } from 'express';
import { asyncWrapper } from 'utils/helpers';
import { FileController } from './files.controller';

/**
 * Роутер: Files
 */
export class CreateRouter {
  constructor() {
    this.router = Router();
  }

  initRoutes() {
    const { router } = this;

    /**
     * Get file by hash
     * @swagger
     * path:
     *  /source/{ownerType}/{hash}:
     *      get:
     *        tags:
     *          - Files
     *        description: Get file
     *        summary: Get file by hash
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
    router.get('/source/:ownerType/:hash', asyncWrapper(FileController.getFile));

    /**
     * Save file
     * @swagger
     * path:
     *  /files:
     *     post:
     *        tags:
     *          - Files
     *        description: Save file
     *        summary: Save file
     *        produces:
     *          - application/json
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
    router.post('/', asyncWrapper(FileController.saveFile));

    return router;
  }
}
