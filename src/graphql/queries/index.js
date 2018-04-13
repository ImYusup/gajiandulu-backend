const { user, users } = require('./user-queries');
const { getAdmins } = require('./admin-management-queries');
const { loans_id } = require('./loans-queries');
const { loans_all } = require('./loans-queries');

module.exports = {
  user,
  users,
  getAdmins,
  loans_id,
  loans_all
};
