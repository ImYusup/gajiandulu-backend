'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'registration_complete', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
      .then(() =>
        queryInterface.addColumn('users', 'currency', {
          type: Sequelize.ENUM('IDR', 'USD'),
          defaultValue: 'IDR'
        })
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('users', 'registration_complete')
      .then(() => queryInterface.removeColumn('users', 'currency'));
  }
};
