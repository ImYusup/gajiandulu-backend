'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      pin: {
        allowNull: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      date_of_birth: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      hash: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      is_confirmed_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      role_id: {
        allowNull: true,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
        defaultValue: 2
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),

  down: queryInterface => queryInterface.dropTable('users')
};
