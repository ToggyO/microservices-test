/**
 * Описание: миграции для таблицы refresh_tokens
 */
const { DataTypes } = require('sequelize');
const scheme = require('../models/refreshToken');

module.exports = {
  up: async (queryInterface, sequelize) => {
    await queryInterface.createTable(
      'refresh_tokens',
      scheme(sequelize, DataTypes),
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('refresh_tokens', null);
  },
};
