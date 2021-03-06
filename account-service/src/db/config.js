/**
 * Описание: конфиг для корректной работы команды миграции и seed для sequelize-cli
 */
import config from '@config';

module.exports = {
  development: {
    username: config.MIC_ACCOUNT_POSTGRES_USER,
    password: config.MIC_ACCOUNT_POSTGRES_PASSWORD,
    database: config.MIC_ACCOUNT_POSTGRES_DATABASE,
    host: config.MIC_ACCOUNT_POSTGRES_HOST,
    dialect: 'postgres',
  },
  production: {
    username: config.MIC_ACCOUNT_POSTGRES_USER,
    password: config.MIC_ACCOUNT_POSTGRES_PASSWORD,
    database: config.MIC_ACCOUNT_POSTGRES_DATABASE,
    host: config.MIC_ACCOUNT_POSTGRES_HOST,
    dialect: 'postgres',
  },
};
