/**
 * Описание: Файл содержит контроллер для обработки роутинга авторизации
 */
import { getSuccessRes } from '@utils/response';
import { getProp } from '@utils/helpers';
import { AuthService } from './auth.service';

export const AuthController = {};

/**
 * Авторизация пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
AuthController.login = async (req, res, next) => {
  try {
    const body = getProp(req, 'body', {});
    const resultData = await AuthService.login(body);
    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление аксесс токена
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
AuthController.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = getProp(req, 'body', {});
    const resultData = await AuthService.refreshToken(refreshToken);
    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};
