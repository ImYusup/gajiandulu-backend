const { user, users } = require('./user-queries');
const { getAdmins } = require('./admin-management-queries');

module.exports = {
  user,
  users,
  getAdmins
};