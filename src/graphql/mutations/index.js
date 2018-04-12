const { createAdmin, updateAdmin, deleteAdmin } = require('./admin-management-mutations');
const { updateLoan, deleteLoan } = require('./loans-mutations');
const updateUser = require('./user/update');

module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateLoan,
  deleteLoan,
  updateUser
};
