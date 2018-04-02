'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.changeColumn('occupations', 'name', {
      type: Sequelize.ENUM('pelajar', 'pegawai', 'pengusaha', 'polisi-tni', 'irt', 'none')
    });
  },

  down: (queryInterface, Sequelize) => {
    //
  }
};
