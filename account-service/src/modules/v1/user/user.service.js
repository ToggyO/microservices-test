/**
 * Описание: Файл содержит сервис для модуля Партнеры
 */
import { getProp, basicService, customCrypto } from '@utils/helpers';
import { ApplicationError } from '@utils/response';
import { ERROR_CODES } from '@constants';
import { UserModel } from './user.model';
import { UserValidator } from './user.validator';

export const UserService = Object.create(basicService);

UserService._getModel = () => UserModel;
UserService._getModels = () => UserModel._getModels();

/**
 * Получить список пользователей
 * @param {object} where
 * @param {array} [attributes]
 * @param {array} [include]
 * @param {object} pagination
 * @param {array} order
 * @returns {Promise<object>}
 */
UserService.getUsers = async function ({
  where = {},
  attributes = [],
  include = [],
  pagination = {},
  order = [],
} = {}) {
  const users = await UserModel.findAndCountAll({
    where,
    ...(Array.isArray(attributes) ? { attributes } : {}),
    ...(Array.isArray(include) ? { include } : {}),
    ...pagination,
    order,
  });
  const items = getProp(users, 'rows', []);
  const count = getProp(users, 'count', []);
  return {
    items,
    ...(UserService._getPaginationResponse({ count }, pagination)),
  };
};

/**
 * Получить пользователя
 * @param {object} where
 * @param {array} [attributes]
 * @param {array} [include]
 * @returns {Promise<object>}
 */
UserService.getUser = async function ({
  where = {},
  attributes = [],
  include = [],
} = {}) {
  return UserModel.findOne({
    where,
    ...(Array.isArray(attributes) ? { attributes } : {}),
    ...(Array.isArray(include) ? { include } : {}),
  });
};

/**
 * Создать пользователя
 * @param {object} values
 * @returns {object}
 */
UserService.createUser = async function ({ values = {} }) {
  const driedValues = UserService._dryPayload(values, UserService._createPayloadSchema());

  await UserValidator.createUpdateUserValidator(driedValues);

  const isExists = await UserService.getUser({ where: { email: driedValues.email } });

  if (isExists) {
    throw new ApplicationError({
      statusCode: 409,
      errorCode: ERROR_CODES.conflict,
      errorMessage: 'User with the same email already exists',
      errors: [],
    });
  }

  const withHashedData = (data) => ({
    ...data,
    ...(values.password ? customCrypto.hashPassword(values.password) : {}),
  });

  const options = {
    model: UserModel,
    modelSchemaKey: '_isCreatable',
    callback: withHashedData,
  };

  const allowedValues = UserService._useSchema(driedValues, options);

  const createdUser = await UserModel.create(allowedValues);

  return createdUser;
};

/**
 * Редактировать пользователя
 * @param {number|string} id
 * @param {object} values
 * @returns {void}
 */
UserService.updateUser = async function ({ id, values = {} }) {
  const driedValues = UserService._dryPayload(values, UserService._updatePayloadSchema());

  await UserValidator.createUpdateUserValidator(driedValues);

  await UserModel.update(
    driedValues,
    {
      where: { id },
      returning: false,
    },
  );
};

/**
 * Загрузка файла компании-партнера
 * @param {number} id
 * @returns {number} - количество удаленных сущностей
 */
UserService.deleteUser = async function ({ id }) {
  const deletedRowsCount = await UserModel.destroy({ where: { id } });

  return deletedRowsCount;
};

/**
 * Схема преобразования данных для создания
 * @returns {object}
 */
UserService._createPayloadSchema = () => ({
  email: value => value,
  password: value => value,
  name: value => value,
  age: value => value,
});

/**
 * Схема преобразования данных для редактирования
 * @returns {object}
 */
UserService._updatePayloadSchema = () => ({
  name: value => value,
  age: value => value,
});
