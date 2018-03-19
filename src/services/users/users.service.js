const createUserModel = require('../../models/users.model');
const hooks = require('./users.hooks.js');
const response = require('../response');

const userService = (User, paginate) => ({
  find: async params => {
    const user = await User.all();
    return response(true, 'User retrieved successfully', user, null);
  },

  get: async (id, params) => {
    const user = await User.findOne({ where: { id } });
    if (user === null) {
      throw new Error(false, 'User not found!');
    }
    return response(true, 'User retrieved successfully', user, null);
  },

  update: async (id, data, params) => {
    await User.update(data.data, { where: { id: id } });
    const user = await User.findOne({ id });
    if (user === null) {
      return response(false, 'User update failed');
    }
    return response(true, 'User updated successfully', user, null);
  },

  remove: async (id, params) => {
    const user = await User.destroy({ where: { id } });
    if (user === 0) {
      throw new Error(`User with id ${id} not found`);
    }
    return null;
  }
});

module.exports = function(app) {
  app.use('/users', userService(createUserModel(app)));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users');

  service.hooks(hooks);
};
