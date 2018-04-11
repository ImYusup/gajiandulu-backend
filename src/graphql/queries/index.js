const { user, users } = require('./user-queries');
const { getAdmins } = require('./admin-management-queries');
const { loan, loans } = require('./loans-queries');
const { digitalAssets } = require('./digital-assets-queries');

module.exports = {
  user,
  users,
  getAdmins,
  loan,
  loans,
  digitalAssets
};
