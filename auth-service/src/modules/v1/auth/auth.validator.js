/**
 * Описание: Файл содержит функции валидаторы для модуля Auth
 */
import { Validator } from '@utils/validation';
import { ApplicationError } from '@utils/response';
import { ERROR_CODES } from '@constants';

export const AuthValidator = {};

/**
 * Валидация аутентификации пользователя
 * @param {object} values - Данные пользователя
 * @param {string} values.email - Почтовый ящик пользователя
 * @param {string} values.password - Пароль пользователя
 */
AuthValidator.login = async (values = {}) => {
  const { email, password } = values;

  const errors = [
    ...(new Validator({ value: email, field: 'email' }).required().email().result()),
    ...(new Validator({ value: password, field: 'password' }).required().password().result()),
  ];

  if (errors.length) {
    throw new ApplicationError({
      statusCode: 400,
      errorMessage: 'Invalid income parameters format',
      errorCode: ERROR_CODES.validation,
      errors,
    });
  }
};
