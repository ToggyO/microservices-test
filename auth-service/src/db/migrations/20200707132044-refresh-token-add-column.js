
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'refresh_tokens',
      'updated_at',
      {
        field: 'updated_at',
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('refresh_tokens', 'updated_at');
  },
};
