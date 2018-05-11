'use strict';

module.exports = {
  up: queryInterface => {
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
    queryInterface.bulkInsert('roles', [
      {
        role: 'admin',
        created_at: date,
        updated_at: date
      },
      {
        role: 'manajer',
        created_at: date,
        updated_at: date
      },
      {
        role: 'karyawan',
        created_at: date,
        updated_at: date
      }
    ]);
  },
  down: queryInterface =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    queryInterface.bulkDelete('roles', null, {})
};
