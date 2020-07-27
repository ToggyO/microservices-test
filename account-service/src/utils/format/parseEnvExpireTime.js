import moment from 'moment';

/**
 * Парсинг времени жизни токена
 * @param {string} expireTime - время жизни токена (прим. '1w')
 * @return {string} - дата в формате ISOString
 */
export function parseEnvExpireTime(expireTime) {
  const digits = expireTime.match(/\d/g);
  const words = expireTime.match(/\D/g);
  return moment().add(digits[0], words[0]).toISOString();
}
