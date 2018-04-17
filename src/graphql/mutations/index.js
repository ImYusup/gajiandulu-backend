const { createAdmin, updateAdmin, deleteAdmin } = require('./admin-management-mutations');
const { updateLoan, deleteLoan } = require('./loans-mutations');
const { deleteAssets } = require('./digital-assets-mutations');
module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateLoan,
  deleteLoan,
  deleteAssets
};
