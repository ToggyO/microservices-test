/**
 * Описание: файл для экспорта конфигурациия приложения
 */
import env from './env';

const config = {
  ...env,
  API_URL_PREFIX: `${env.MIC_ACCOUNT_ROUTE_PREFIX}/swagger/v${env.MIC_ACCOUNT_API_VERSION || 1}`,
  RESIZE_RESOLUTION_LIST: JSON.parse(env.RESIZE_RESOLUTION_LIST),
  isProduction: env.NODE_ENV === 'production',
};

export default config;
