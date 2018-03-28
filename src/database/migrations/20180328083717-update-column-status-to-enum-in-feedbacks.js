'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.changeColumn('feedbacks', 'status', {
      type: Sequelize.ENUM('pending', 'verified')
    });
  },

  down: (queryInterface, Sequelize) => {
    //
  }
};
