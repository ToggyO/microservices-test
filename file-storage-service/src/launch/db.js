/**
 * Описание: Подключение к MongoDB
 */
import config from '../config';
import { db } from '../db';

/**
 * Запуск процесса подключения к базе данных
 * @param { object } app - экземпляр приложения
 * @returns {Promise<void>}
 */
export const run = async ({ app }) => {
  try {
    await db.init(
      config.MIC_FILES_MONGO_HOST,
      config.MIC_FILES_MONGO_PORT,
      {
        user: config.MIC_FILES_MONGO_USERNAME,
        pass: config.MIC_FILES_MONGO_PASSWORD,
        dbName: config.MIC_FILES_MONGO_DATABASE,
      },
    );
    const connection = db.getMongooseConnection();
    console.log(`Успешное соединение с базой данных ${connection.host}:${connection.port}/${connection.name}`);

    // привязать экземпляр DB
    app.set('db', db);
  } catch (error) {
    console.info('Ошибка соединения с базой данных! ', error);
  }
};
