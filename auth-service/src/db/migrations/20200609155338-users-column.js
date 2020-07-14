
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'email',
      {
        type: Sequelize.STRING(45),
        unique: true,
        // allowNull: false,
        // defaultValue: '',
        validate: {
          isEmail: true,
        },
        _isCreatable: true,
      },
    );

    await queryInterface.addColumn(
      'users',
      'passwordHash',
      {
        type: Sequelize.STRING,
        // allowNull: false,
        _isHidden: true,
        _isCreatable: true,
      },
    );

    await queryInterface.addColumn(
      'users',
      'salt',
      {
        type: Sequelize.STRING,
        // allowNull: false,
        _isHidden: true,
        _isCreatable: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'passwordHash');
    await queryInterface.removeColumn('users', 'salt');
  },
};
