/**
 * Описание: миграции для таблицы users
 */
const { DataTypes } = require('sequelize');

const scheme = require('../models/user');

module.exports = {
  up: async (queryInterface, sequelize) => {
    await queryInterface.createTable(
      'users',
      scheme(sequelize, DataTypes),
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users', null);
  },
};
