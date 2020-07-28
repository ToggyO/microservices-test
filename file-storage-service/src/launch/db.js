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
  const log = app.get('log');
  try {
    await db.init(
      config.MIC_FILES_MONGO_HOST,
      config.MIC_FILES_MONGO_PORT,
      config.MIC_FILES_MONGO_USERNAME,
      config.MIC_FILES_MONGO_PASSWORD,
      config.MIC_FILES_MONGO_DATABASE,
      {}
    );
    // await db.init(
    //   config.MIC_FILES_MONGO_HOST,
    //   config.MIC_FILES_MONGO_PORT,
    //   {
    //     user: config.MIC_FILES_MONGO_USERNAME,
    //     pass: config.MIC_FILES_MONGO_PASSWORD,
    //     dbName: config.MIC_FILES_MONGO_DATABASE,
    //   },
    // );

    const connection = db.getMongooseConnection();
    connection.once('open', () => {
      console.log(`Соединено с базой данных ${connection.host}:${connection.port}/${connection.name}`);
    })
    connection.on('close', () => console.log('Соединение с базой данных успешно закрыто.'));
    connection.on('error', error => log.error(error));

    // привязать экземпляр DB
    app.set('db', db);
  } catch (error) {
    console.log('error');
    console.info('Ошибка соединения с базой данной: ', error);
  }



};
