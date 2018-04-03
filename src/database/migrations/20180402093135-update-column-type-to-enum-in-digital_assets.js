'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.sequelize.query(
      'ALTER TABLE digital_assets MODIFY COLUMN type ENUM(' +
        '\'buku_tabungan\',\'jaminan_emas\',\'profil\',\'gaji\',\'kartu_identitas\',\'signature\',\'selfie\'' +
        ');'
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
