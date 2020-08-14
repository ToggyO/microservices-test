/**
 * Описание: Файл содержит контроллер для обработки роутинга модуля пользователей
 */
import { ApplicationError, getSuccessRes } from '@utils/response';
import { getProp, getFileURL } from '@utils/helpers';
import { ERROR_CODES } from '@constants';
import { UserService } from './user.service';
import { USER_ERROR_MESSAGES } from './constants';
import { UserModel } from './user.model';

export const UserController = {};

const notFoundErrorPayload = {
  statusCode: 404,
  errorMessage: USER_ERROR_MESSAGES.NOT_FOUND,
  errorCode: ERROR_CODES.not_found,
  errors: [],
};

/**
 * Получить пользователя как общий ответ
 * на операции создания / редактирования / получения по id
 * @param {string|number} id
 * @param {array} include
 * @param {boolean} withAvatar
 * @returns {Promise<object>}
 */
UserController._getEntityResponse = async ({ id, include = null, withAvatar = false }) => {
  const userAttributes = UserService._getModelAttributes({
    model: UserModel,
  });

  const user = await UserService.getUser({
    where: { id },
    attributes: userAttributes,
    include,
  });

  if (withAvatar && user.avatar) {
    user.avatar = getFileURL(user.avatar, 'users');
  }

  return user;
};

/**
 * Получить список пользователей
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
UserController.getUsers = async (req, res, next) => {
  try {
    const query = getProp(req, 'query', {});

    const pagination = UserService._getPagination({ query });
    const userAttributes = UserService._getModelAttributes({ model: UserModel });
    const order = UserService._getSort({ query });
    const filter = UserService._getFilter({ query });

    const resultData = await UserService.getUsers({
      where: { ...filter },
      pagination,
      attributes: userAttributes,
      order: order.length ? order : undefined,
    });

    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Получить пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
UserController.getUser = async (req, res, next) => {
  try {
    const id = parseInt(getProp(req, 'params.id'), 10);

    if (!id) throw new ApplicationError(notFoundErrorPayload);

    const resultData = await UserController._getEntityResponse({ id, withAvatar: true });

    if (!resultData) throw new ApplicationError(notFoundErrorPayload);

    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Создание пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
UserController.createUser = async (req, res, next) => {
  try {
    const body = getProp(req, 'body', {});
    const createdUser = await UserService.createUser({ values: body });

    const resultData = await UserController._getEntityResponse({ id: createdUser.id });

    res.status(201).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Редактирование пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
UserController.updateUser = async (req, res, next) => {
  try {
    const body = getProp(req, 'body', {});
    const id = parseInt(getProp(req, 'params.id', {}), 10);

    if (!id) throw new ApplicationError(notFoundErrorPayload);

    await UserService.updateUser({ id, values: body });

    const resultData = await UserController._getEntityResponse({ id });

    res.status(200).send(getSuccessRes({ resultData }));
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
UserController.deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(getProp(req, 'params.id', {}), 10);

    if (!id) throw new ApplicationError(notFoundErrorPayload);

    const deletedRowsCount = await UserService.deleteUser({ id });

    if (deletedRowsCount === 0) throw new ApplicationError(notFoundErrorPayload);

    res.status(200).send(getSuccessRes({}));
  } catch (error) {
    next(error);
  }
};
