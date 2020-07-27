/**
 * Описание: миграции для таблицы refreshToken
 */

/**
 * Экспорт схемы для sequelize
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object}
 */
const scheme = (sequelize, DataTypes) => ({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    _isCreatale: true,
  },
  refreshToken: {
    field: 'refresh_token',
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  expiresIn: {
    field: 'expires_in',
    type: DataTypes.DATE,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('NOW'),
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('NOW'),
  },
});

module.exports = scheme;
