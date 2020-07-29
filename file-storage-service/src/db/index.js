/**
 * Описание: Класс для работы с базой данных с общими системными методами
 */
import mongoose from 'mongoose';

class Connector {
  #connection = null;

  defaultOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  };

  /**
   * @param {object} props
   * @returns {void}
   */
  constructor(props = {}) {
    Object.keys(props).forEach((propName) => {
      this[`_${propName}`] = props[propName];
    });
  }

  /**
   * Инициализация подключения
   * @param {string} dbHost
   * @param {string} dbPort
   * @param {object} dbOptions
   * @returns {Promise<void>}
   */
  async init(dbHost, dbPort, dbOptions = {}) {
    await mongoose.connect(
      `mongodb://${dbHost}:${dbPort}/admin`,
      { ...this.defaultOptions, ...dbOptions },
    );
    this.#connection = mongoose.connection;
  }

  /**
   * Геттер экземпляра connection
   * @returns {object}
   */
  getMongooseConnection() {
    return this.#connection;
  }
}

export const db = new Connector();
