/**
 * Описание: Подключение к Postgres SQL
 */
import config from '../config';
import { db } from '../db';

/**
 * Запуск процесса подключения к базе данных
 * @param { object } app - экземпляр приложения
 * @returns {Promise<void>}
 */
export const run = async ({ app }) => {
  db.init(config.POSTGRES_DATABASE, config.POSTGRES_USER, config.POSTGRES_PASSWORD, {
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      idle: 10000,
    },
  });

  // Проверка соединения с базой данных
  try {
    await db.testConnection();
    console.info('Соединение с базой данной прошло успешно!');
    // привязать экземпляр DB
    app.set('db', db);
  } catch (error) {
    console.info('Ошибка соединения с базой данной: ', error);
  }
};
