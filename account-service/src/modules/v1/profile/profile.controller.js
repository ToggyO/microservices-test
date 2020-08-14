/**
 * Описание: Файл содержит контроллер для обработки роутинга модуля профиля текущего пользователя
 */
import { getProp } from '@utils/helpers';
import { ApplicationError, getSuccessRes } from '@utils/response';
import { ERROR_CODES, UNPROCESSABLE_ENTITY } from '@constants';
import { USER_ERROR_MESSAGES } from '../user/constants';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { ProfileService } from './profile.service';

export const ProfileController = {};

const notFoundErrorPayload = {
  statusCode: 404,
  errorMessage: USER_ERROR_MESSAGES.NOT_FOUND,
  errorCode: ERROR_CODES.not_found,
  errors: [],
};

/**
 * Получить текущего авторизированного пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
ProfileController.getCurrentUserProfile = async (req, res, next) => {
  try {
    const id = parseInt(getProp(req, '_userData.id'), 10);

    if (!id) throw new ApplicationError(notFoundErrorPayload);

    const resultData = await UserController._getEntityResponse({ id });
    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Изменить текущего авторизированного пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
ProfileController.updateCurrentUserProfile = async (req, res, next) => {
  try {
    const body = getProp(req, 'body', {});
    const id = parseInt(getProp(req, '_userData.id'), 10);

    if (!id) throw new ApplicationError(notFoundErrorPayload);

    await UserService.updateUser({ id, values: body });

    const resultData = await UserController._getEntityResponse({ id });

    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Загрузить аватар текущего авторизированного пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
ProfileController.uploadAvatar = async (req, res, next) => {
  try {
    const id = parseInt(getProp(req, '_userData.id'), 10);
    const oldHash = getProp(req, '_userData.avatar.fileName');
    const avatar = getProp(req, 'files', null);

    if (!id) throw new ApplicationError(notFoundErrorPayload);

    if (!avatar || !Object.keys(avatar).length) {
      throw new ApplicationError({
        statusCode: 422,
        errorMessage: 'No files was uploaded',
        errorCode: UNPROCESSABLE_ENTITY,
        errors: [],
      });
    }

    // const resultData = await ProfileService.uploadAvatar({ avatar, id });
    await ProfileService.uploadAvatar({ avatar, id, oldHash });

    const resultData = await UserController._getEntityResponse({ id, withAvatar: true });

    res.status(201).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить аватар текущего авторизированного пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
ProfileController.deleteAvatar = async (req, res, next) => {
  try {
    const id = parseInt(getProp(req, '_userData.id'), 10);
    const avatar = getProp(req, '_userData.avatar', null);
    // const fileName = getProp(req.body, 'fileName', null);

    if (!id || !avatar) throw new ApplicationError(notFoundErrorPayload);
    // if (!id || !fileName) throw new ApplicationError(notFoundErrorPayload);

    const resultData = await ProfileService.deleteAvatar({ id, file: avatar });
    // const resultData = await ProfileService.deleteAvatar({ id, file: fileName });

    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};
