/**
 * Описание: Класс для работы с базой данных с общими системными методами
 */
import { connect, connection } from 'mongoose';

import { FileModel } from 'modules/v1/files/files.model';

class Connector {
  #connection = null;

  #modelsList = {};

  #models = {};

  defaultOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  /**
   * @param {object} props
   * @returns {void}
   */
  constructor(props = {}) {
    Object.keys(props).forEach((propName) => {
      this[`_${propName}`] = props[propName];
    });

    this.#modelsList = {
      FileModel,
    };
  }

  /**
   * Инициализация подключения
   * @param {string} dbHost
   * @param {string} dbPort
   * @param {object} dbOptions
   * @returns {Promise<void>}
   */
  async init(dbHost, dbPort, dbOptions = {}) {
    await connect(
      `mongodb://${dbHost}:${dbPort}/admin`,
      { ...this.defaultOptions, ...dbOptions },
    );
    this.#connection = connection;
    this.#initModels();
  }

  /**
   * Инициализация моделей
   * @returns {void}
   */
  #initModels = () => {
    const { Connection } = this;
    Object.entries(this.#modelsList).forEach(([key, Model]) => {
      this.#models = {
        ...this.#models,
        [key]: new Model({ connection: Connection }).model,
      };
    });
  }

  /**
   * Геттер доступных моделей экземпляра
   * @returns {object}
   */
  get Models() {
    return this.#models;
  }

  /**
   * Геттер экземпляра connection
   * @returns {object}
   */
  get Connection() {
    return this.#connection;
  }
}

export const db = new Connector();
