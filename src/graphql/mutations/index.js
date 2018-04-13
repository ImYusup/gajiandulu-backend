const { createAdmin } = require('./admin-management-mutations');
const { updateAdmin } = require('./admin-management-mutations');
const { deleteAdmin } = require('./admin-management-mutations');
const { updateUser, deleteUser } = require('./user-mutations');
module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateUser,
  deleteUser
};
