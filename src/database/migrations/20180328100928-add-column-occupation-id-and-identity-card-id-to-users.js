'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'occupation_id', {
        type: Sequelize.INTEGER,
        references: { model: 'occupations', key: 'id' }
      })
      .then(() =>
        queryInterface.addColumn('users', 'identity_card_id', {
          type: Sequelize.INTEGER,
          references: { model: 'identity_cards', key: 'id' }
        })
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('users', 'occupation_id')
      .then(() => queryInterface.removeColumn('users', 'identity_card_id'));
  }
};
