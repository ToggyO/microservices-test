'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'avatar',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        _isEditable: true,
        _isCreatable: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'users',
      'avatar',
    );
  },
};
