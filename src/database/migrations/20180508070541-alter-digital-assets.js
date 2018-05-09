'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(
        'ALTER TABLE digital_assets DROP user_id, DROP FOREIGN KEY digital_assets_ibfk_1'
      )
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE digital_assets ADD COLUMN uploadable_type VARCHAR(255) NOT NULL AFTER type;'
        )
      )
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE digital_assets ADD COLUMN uploadable_id INTEGER NOT NULL AFTER uploadable_type;'
        )
      )
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE digital_assets MODIFY COLUMN created_at DATETIME AFTER uploadable_id;'
        )
      )
      .then(() =>
        queryInterface.sequelize.query(
          'ALTER TABLE digital_assets MODIFY COLUMN updated_at DATETIME AFTER created_at;'
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
