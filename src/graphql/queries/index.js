const { user, users } = require('./user-queries');
const { getAdmins } = require('./admin-management-queries');
const { loan, loans } = require('./loans-queries');
const { role, roles } = require('./role-queries');

module.exports = {
  user,
  users,
  getAdmins,
  loan,
  loans,
  role,
  roles
};
