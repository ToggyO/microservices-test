/**
 * Описание: Слой для работы с таблицей компании партнера в базе данных
 */
import { DataTypes, Model } from 'sequelize';

import { db } from '@db';
import scheme from '@db/models/user';

export class UserModel extends Model {}

export const initializeModel = () => {
  const sequelize = db.getSequelizeInstance();

  UserModel.init(
    scheme(sequelize, DataTypes),
    {
      sequelize,
      modelName: 'user',
      tableName: 'users',
      timestamps: true,
    },
  );

  /**
   * Обратный вызов на момент инициализации всех доступных моделей
   * @param models
   */
  UserModel.onAllModelsInitialized = (models = {}) => {
    const { AuthModel } = models;

    UserModel.hasMany(AuthModel, {
      as: 'refreshToken',
    });

    UserModel._getModels = () => models;
  };

  return UserModel;
};
