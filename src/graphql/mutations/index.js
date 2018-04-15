const { createAdmin, updateAdmin, deleteAdmin } = require('./admin-management-mutations');
const { updateLoan, deleteLoan } = require('./loans-mutations');
module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateLoan,
  deleteLoan
};
