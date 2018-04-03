'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      period: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      service_charge: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      interest_rate: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      interest_charge: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      due_date_charge: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      total: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      purpose: {
        allowNull: false,
        type: Sequelize.STRING
      },
      materai_charge: {
        allowNull: false,
        type: Sequelize.STRING
      },
      due_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      promo_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      promo_discount: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      paid: {
        allowNull: false,
        type: Sequelize.TINYINT
      },
      status:{
        allowNull: false,
        type: Sequelize.TINYINT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('loans');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
