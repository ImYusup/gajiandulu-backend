'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('presences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        allowNull: true,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'employees',
          key: 'id'
        },
      },
      presence_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      presence_start: {
        allowNull: false,
        type: Sequelize.DATE
      },
      presence_end: {
        allowNull: false,
        type: Sequelize.DATE
      },
      rest_start: {
        allowNull: false,
        type: Sequelize.DATE
      },
      rest_end: {
        allowNull: false,
        type: Sequelize.DATE
      },
      is_absence: {
        type: Sequelize.TINYINT,
        defaultValue: false
      },
      is_leave: {
        type: Sequelize.TINYINT,
        defaultValue: false
      },
      overwork: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      work_hours: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      salary: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fine: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('presences');
  }
};