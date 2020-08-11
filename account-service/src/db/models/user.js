/**
 * Описание: миграции для таблицы users
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
  email: {
    type: DataTypes.STRING(45),
    unique: true,
    validate: {
      isEmail: true,
    },
    _isCreatable: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    _isHidden: true,
    _isCreatable: true,
  },
  salt: {
    type: DataTypes.STRING,
    _isHidden: true,
    _isCreatable: true,
  },
  name: {
    field: 'name',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  age: {
    field: 'age',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    _isEditable: true,
    _isCreatable: true,
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
