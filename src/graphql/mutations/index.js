const { createAdmin, updateAdmin, deleteAdmin } = require('./admin-management-mutations');
const { updateLoan, deleteLoan } = require('./loans-mutations');
const { updateUser, deleteUser } = require('./user-mutations');

module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateLoan,
  deleteLoan,
  updateUser,
  deleteUser
};
