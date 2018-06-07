const {
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('./admin-management-mutations');
const { updateLoan, deleteLoan } = require('./loans-mutations');
const { updateUser, deleteUser } = require('./user-mutations');
const { updateBankAccount } = require('./bank-account-mutations');
const { updateOccupation } = require('./occupation-mutations');
const { updateFamily } = require('./family-mutations');
const { updateIdentityCard } = require('./identity-card-mutations');
const {
  createDigitalAssets,
  deleteAssets
} = require('./digital-assets-mutations');
const { createEmployee, deleteEmployee } = require('./employee-mutations');

module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateLoan,
  deleteLoan,
  updateUser,
  deleteUser,
  updateBankAccount,
  updateOccupation,
  updateFamily,
  updateIdentityCard,
  createDigitalAssets,
  deleteAssets,
  createEmployee,
  deleteEmployee
};
