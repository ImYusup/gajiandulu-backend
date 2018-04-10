'use strict';
const crypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const date = new Date();
    queryInterface.bulkInsert('users', [
      {
        full_name: 'administrator',
        email: 'admin@example.com',
        password: crypt.hashSync('Sup3rs3cr3t', 15),
        date_of_birth: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        is_confirmed_email: 1,
        role_id: 1,
        hash: crypt.hashSync(date.toString() + 'admin@example.com', 10),
        registration_complete: 1,
        created_at: date,
        updated_at: date
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
