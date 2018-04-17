const {
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('./admin-management-mutations');
const { updateLoan, deleteLoan } = require('./loans-mutations');
const { updateUser, deleteUser } = require('./user-mutations');
const { updateBankAccount } = require('./bank-account-mutations');
const { updateOccupation } = require('./occupation-mutations');

module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateLoan,
  deleteLoan,
  updateUser,
  deleteUser,
  updateBankAccount,
  updateOccupation
};
