/**
 * Описание: Класс для работы с базой данных с общими системными методами
 */
import Sequelize from 'sequelize';

class Connector {
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
   * @param {string} dbName
   * @param {string} dbUser
   * @param {string} dbPassword
   * @param {object} dbOptions
   * @returns {void}
   */
  init(dbName, dbUser, dbPassword, dbOptions = {}) {
    this._sequelize = new Sequelize(dbName, dbUser, dbPassword, dbOptions);
  }

  /**
   * Геттер экземпляра
   * @returns {Promise}
   */
  testConnection() {
    return this._sequelize.authenticate();
  }

  /**
   * Геттер экземпляра sequelize
   * @returns {object}
   */
  getSequelizeInstance() {
    return this._sequelize;
  }
}

export const db = new Connector();
