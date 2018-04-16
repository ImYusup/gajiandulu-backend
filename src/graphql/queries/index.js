const { user, users } = require('./user-queries');
const { getAdmins } = require('./admin-management-queries');
const { loan, loans } = require('./loans-queries');

module.exports = {
  user,
  users,
  getAdmins,
  loan,
  loans
};
