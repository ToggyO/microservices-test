/**
 * Описание: Файл содержит сервис для модуля Авторизации
 */
import { ERROR_CODES } from '@constants';
import { basicService, customCrypto } from '@utils/helpers';
import { ApplicationError } from '@utils/response';
import { generateToken, checkToken } from '@utils/authentication';
import { UserService } from '@modules/v1/user/user.service';
import { AuthValidator } from './auth.validator';
import { AuthModel } from './auth.model';
import { UserController } from '../user/user.controller';

export const AuthService = Object.create(basicService);

/**
 * Авторизация
 * @param {object} values - Объект пользователя
 * @param {string} values.email - Почтовый ящик пользователя
 * @param {string} values.password - Пароль пользователя
 * @returns {Promise<any>} - Результат
 */
AuthService.login = async (values = {}) => {
  const driedValues = AuthService._dryPayload(values, AuthService._getLoginPayloadScheme());

  await AuthValidator.login(driedValues);

  const invalidCredentialsErrorPayload = {
    statusCode: 400,
    errorMessage: 'User doesnt exist or credentials is wrong',
    errorCode: ERROR_CODES.authorization__invalid_credentials_error,
    errors: [],
  };

  const user = await UserService.getUser({
    where: { email: driedValues.email },
    include: ['refreshToken'],
  });

  if (!user) {
    throw new ApplicationError(invalidCredentialsErrorPayload);
  }

  const {
    id,
    passwordHash,
    salt,
    refreshToken = [],
  } = user;
  const verifiedPassword = customCrypto.verifyPassword(
    driedValues.password,
    passwordHash,
    salt,
  );

  if (!verifiedPassword) {
    throw new ApplicationError(invalidCredentialsErrorPayload);
  }

  const {
    accessToken,
    accessExpire,
    refreshToken: newRefreshToken,
    refreshExpire,
  } = generateToken({ userId: user.id, login: user.email });

  if (refreshToken.length >= 5) {
    await AuthModel.deleteRefreshTokens({
      where: { userId: id },
    });
  }

  await AuthModel.saveRefreshToken({
    userId: user.id,
    refreshToken: newRefreshToken,
    expiresIn: refreshExpire,
  });

  const authData = {
    id: user.id,
    email: user.email,
    // role: user.role,
    tokens: {
      accessToken,
      expire: accessExpire,
      refreshToken: newRefreshToken,
    },
  };

  return authData;
};

/**
 * Обновление аксесс токена с помощью рефреш токена
 * @returns {Promise<any>} - Результат
 */
AuthService.refreshToken = async (incomingToken) => {
  const { userId } = await checkToken(incomingToken);

  const user = await UserController._getEntityResponse({ id: userId, include: ['refreshToken'] });

  const unauthorizedErrorPayload = {
    statusCode: 401,
    errorMessage: 'Refresh token is expired or invalid',
    errorCode: ERROR_CODES.security__invalid_token_error,
    errors: [],
  };

  if (!user) {
    throw new ApplicationError(unauthorizedErrorPayload);
  }

  const { refreshToken = [] } = user;
  const isTokenExists = refreshToken.some(record => {
    const isExists = record.refreshToken === incomingToken;
    const isExpired = record.expiresIn.toISOString() > new Date().toISOString();
    return isExists && isExpired;
  });

  if (!isTokenExists) {
    throw new ApplicationError(unauthorizedErrorPayload);
  }

  const {
    accessToken,
    accessExpire,
    refreshToken: newRefreshToken,
    refreshExpire,
  } = generateToken({ userId: user.id, login: user.email });

  if (refreshToken.length >= 5) {
    await AuthModel.deleteRefreshTokens({
      where: { userId },
    });
    await AuthModel.saveRefreshToken({
      userId: user.id,
      refreshToken: newRefreshToken,
      expiresIn: refreshExpire,
    });
  } else {
    await AuthModel.rewriteRefreshToken(
      {
        refreshToken: newRefreshToken,
        expiresIn: refreshExpire,
      },
      {
        where: { refreshToken: incomingToken },
      },
    );
  }

  const newTokensPayload = {
    accessToken,
    expire: accessExpire,
    refreshToken: newRefreshToken,
  };

  return newTokensPayload;
};

/**
 * Схема преобразования данных для аутентификации пользователя
 */
AuthService._getLoginPayloadScheme = () => ({
  email: value => value,
  password: value => value,
});
