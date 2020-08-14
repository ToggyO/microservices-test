/**
 * Middleware для проверки прав доступа пользователя на основе его роли
 */
import jwt from 'jsonwebtoken';

import config from '@config';
import { UserController } from '@modules/v1/user/user.controller';
import { ApplicationError } from '@utils/response';
import { ERROR_CODES } from '@constants';

const unauthorizedErrorPayload = {
  statusCode: 401,
  errorMessage: 'Access token is expired or invalid',
  errorCode: ERROR_CODES.security__invalid_token_error,
  errors: [],
};

/**
 * Проверка токена на валидность
 * @param {string} token - проверяемый токен
 * @returns {object} - результат проверки
 */
export const checkToken = async (token) => {
  const { JWT_SECRET } = config;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw new ApplicationError(unauthorizedErrorPayload);
    }

    throw error;
  }
};

/**
 * Создание промежуточного обработчика для проверки прав доступа к роуту
 * @param {array|null} allowedRoles - массив разрешенных ролей. Если null, то разрешены все роли.
 * @returns {function} - промежуточный обработчик
 */
export const authenticate = (allowedRoles = []) => async (req, res, next) => {
  const { AUTHORIZATION_HEADER } = config;
  const accessToken = ((req.get(AUTHORIZATION_HEADER) || req.get(AUTHORIZATION_HEADER.toLowerCase())) || '')
    .replace('Bearer ', '');

  if (!accessToken) {
    throw new ApplicationError(unauthorizedErrorPayload);
  }

  const { userId } = await checkToken(accessToken);
  const userData = await UserController._getEntityResponse({ id: userId, withAvatar: true });
  req._userData = userData.dataValues;

  // if (allowedRoles !== null && !allowedRoles.includes(userData.role)) {
  // 	throw new ApplicationError({
  // 		statusCode: 403,
  // 		errorMessage: 'Доступ запрещен.',
  // 		errorCode: ERROR_CODES.security__no_permissions,
  // 		errors: [],
  // 	});
  // }

  if (allowedRoles !== null) {
    throw new ApplicationError({
      statusCode: 403,
      errorMessage: 'Доступ запрещен.',
      errorCode: ERROR_CODES.security__no_permissions,
      errors: [],
    });
  }

  next();
};

// Expired access token
// eslint-disable-next-line max-len
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImxvZ2luIjoicXdlQHF3ZS5jb20iLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk0MDkxMDczLCJleHAiOjE1OTQwOTExMzN9.VNMo1YjoAlokPA-3YRX3gSdr5SxCrhDe97RPpeRDIsc
// Expired refresh token
// eslint-disable-next-line max-len
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNTk0MDkwOTk1LCJleHAiOjE1OTQwOTExMTV9.FbMek0S8Li_-HMbOYyKv84lZ77b2BXk_s4fCudHVeU4
