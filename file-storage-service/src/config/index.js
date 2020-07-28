/**
 * Описание: файл для экспорта конфигурациия приложения
 */
import env from './env';

const config = {
  ...env,
  API_URL_PREFIX: `${env.MIC_FILES_ROUTE_PREFIX}/swagger/v${env.MIC_FILES_API_VERSION || 1}`,
  isProduction: env.NODE_ENV === 'production',
};

export default config;
