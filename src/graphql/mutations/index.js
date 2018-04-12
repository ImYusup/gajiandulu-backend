const { createAdmin } = require('./admin-management-mutations');
const { updateAdmin } = require('./admin-management-mutations');
const { deleteAdmin } = require('./admin-management-mutations');
module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin
};
