/**
 * Описание: Слой для работы с таблицей рефреш токенов в базе данных
 */
import { Model, DataTypes } from 'sequelize';
import scheme from '@db/models/refreshToken';
import { db } from '@db';

export class AuthModel extends Model {
	/**
	 * Получить список рефреш токенов из таблицы
	 * @param {object} where - Параметры поиска
	 * @param {array} [attributes] - Массив аттрибутов
	 * @param {array} [include] - Вложенные данные
	 * @returns {Promise<Array<AuthModel>>}
	 */
	static getRefreshTokens = async ({ where = {}, attributes, include } = {}) => (
	  AuthModel.findAll({
	    where,
	    ...(Array.isArray(attributes) ? { attributes } : {}),
	    ...(Array.isArray(include) ? { include } : {}),
	  }));

	/**
	 * Записать рефреш токен в таблицу
	 * @param {object} payload
	 * @returns {Promise<AuthModel>}
	 */
	static saveRefreshToken = async (payload = {}) => (
	  AuthModel.create(payload)
	);

	/**
	 * Перезаписать рефреш токен в таблицу вместо использованного
	 * @param {string} refreshToken - токен для перезаписи
	 * @param {string} expiresIn - время жизни токена для перезаписи
	 * @param {object} where - Параметры поиска
	 * @returns {Promise<void>}
	 */
	static rewriteRefreshToken = async (
	  { refreshToken, expiresIn } = {},
	  { where = {} } = {},
	) => (
	  AuthModel.update(
	    {
	      refreshToken,
	      expiresIn,
	    },
	    {
	      where,
	    },
	  )
	);

	/**
	 * Удалить одни или несколько рефреш токенов из таблицы
	 * @param {object} where - Параметры поиска
	 * @returns {Promise<void>}
	 */
	static deleteRefreshTokens = async ({ where = {} } = {}) => (
	  AuthModel.destroy({ where })
	);
}

export const initializeModel = () => {
  const sequelize = db.getSequelizeInstance();

  AuthModel.init(
    scheme(sequelize, DataTypes),
    {
      sequelize,
      modelName: 'refresh_token',
      tableName: 'refresh_tokens',
      timestamps: true,
    },
  );

  /**
   * Обратный вызов на момент инициализации всех доступных моделей
   * @param models
   */
  AuthModel.onAllModelsInitialized = (models = {}) => {
    const { UserModel } = models;

    AuthModel.belongsTo(UserModel, {
      foreignKey: 'user_id',
      as: 'user',
    });

    AuthModel._getModels = () => models;
  };

  return AuthModel;
};
