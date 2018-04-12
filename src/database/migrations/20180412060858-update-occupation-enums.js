'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('ALTER TABLE occupations DROP COLUMN name')
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE occupations ADD COLUMN name ENUM(' +
            '\'pelajar\',\'pegawai\',\'pengusaha\',\'aparat\',\'irt\',\'none\'' +
            ');'
        )
      );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
