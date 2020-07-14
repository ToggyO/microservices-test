import jwt from 'jsonwebtoken';

import config from '@config';
import { parseEnvExpireTime } from '@utils/format';

/**
 * Генерация токена
 * @param {int} userId - идентификатор пользователя
 * @param {string} login - логин пользователя
 * @return {string} - токен
 */
export const generateToken = ({ userId, login }) => {
  const {
    JWT_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
  } = config;

  return {
    accessToken: jwt.sign({
      userId,
      login,
      type: 'access',
    }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN }),
    accessExpire: parseEnvExpireTime(JWT_ACCESS_EXPIRES_IN),
    refreshToken: jwt.sign({
      userId,
      type: 'refresh',
    }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN }),
    refreshExpire: parseEnvExpireTime(JWT_REFRESH_EXPIRES_IN),
  };
};
