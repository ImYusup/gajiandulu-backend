'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize
      .query('ALTER TABLE digital_assets DROP COLUMN type')
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE digital_assets MODIFY COLUMN type ENUM(' +
            '\'pelajar\',\'pegawai\',\'pengusaha\',\'polisi-tni\',\'irt\',\'none\'' +
            ');'
        )
      );
  },

  down: (queryInterface, Sequelize) => {
    //
  }
};
