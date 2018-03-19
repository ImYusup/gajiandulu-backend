const crypt = require('bcrypt');
const createUserModel = require('../../models/users.model.js');
const hooks = require('./register.hooks');
const response = require('../response');

const registerService = User => ({
  find: async params => {},

  get: async (id, params) => {},

  create: async (data, params) => {
    const hashPassword = crypt.hashSync(data.password, 15);
    const payload = Object.assign({}, data, { password: hashPassword });
    const user = await User.create(payload);
    return response(true, 'User has been registered successfully', user, null);
  },

  update: async (id, data, params) => {
    //
  },

  remove: async (id, params) => {
    //
  }
});

module.exports = function(app) {
  // Initialize our service with any options it requires
  app.use('/register', registerService(createUserModel(app)));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('register');

  service.hooks(hooks);
};
