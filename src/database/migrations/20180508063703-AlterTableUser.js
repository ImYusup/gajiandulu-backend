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
      .query('ALTER TABLE users DROP FOREIGN KEY users_ibfk_1, DROP FOREIGN KEY users_occupation_id_foreign_idx, DROP FOREIGN KEY users_identity_card_id_foreign_idx, DROP COLUMN role_id, DROP COLUMN occupation_id, DROP COLUMN identity_card_id')
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE users ADD is_active_notif TINYINT(1) AFTER hash, MODIFY currency VARCHAR(45) AFTER is_confirmed_email, CHANGE date_of_birth birthday DATE, MODIFY registration_complete TINYINT(1) AFTER currency'
        )
      );
  },


  down: (queryInterface, Sequelize) =>  queryInterface.dropTable('users')
  /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
};

