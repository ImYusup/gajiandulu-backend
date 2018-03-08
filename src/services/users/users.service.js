// Initializes the `users` service on path `/users`
const createService = require('feathers-sequelize');
const crypt = require('bcrypt');

const createUserModel = require('../../models/users.model');
const hooks = require('./users.hooks.js');
const response = require('../response');

const userService = (User, paginate) => ({
  find: async params => {
    const user = await User.all();
    return response('Phones retrieved', user, {}, null);
  },

  get: async (id, params) => {
    const user = await User.findOne({ where: { id } });
    if (user === null) {
      throw new Error('User not found!');
    }
    return response('User retrieved', user, {}, null);
  },

  create: async ({ data }, params) => {
    const hashPassword = crypt.hashSync(data.password, 15);
    const payload = Object.assign({}, data, { password: hashPassword });
    const user = await User.create(payload);

    return response('User created', user, {}, null);
  },

  update: async (id, data, params) => {
    await User.update(data.data, { where: { id: id } });
    const user = await User.findOne({ id });
    return user ? response('Phone updated', user, {}, null) : user;
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
  const Model = createUserModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'users',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/users', userService(options.Model, paginate));
  app.use('/users', createService(options));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users');

  service.hooks(hooks);
};
