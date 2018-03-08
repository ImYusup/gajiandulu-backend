// Initializes the `users` service on path `/users`
const createService = require('feathers-sequelize');

const createPhoneModel = require('../../models/phones.model');
const createUserModel = require('../../models/users.model');
const hooks = require('./phones.hooks');
const response = require('../response');

const phoneService = (Phone, User) => ({
  find: async params => {
    const phone = await Phone.all();
    return response('Phones retrieved', phone, {}, null);
  },

  get: async (id, params) => {
    const phone = await Phone.findOne({ where: { id } });
    if (phone === null) {
      throw new Error('Phone not found!');
    }
    return response('Phone retrieved', phone, {}, null);
  },

  create: async ({ data }, params) => {
    const phone = await Phone.create(data);
    await User.update(
      {
        phone_id: phone.id
      },
      {
        where: {
          id: data.user_id
        }
      }
    );
    const user = await User.findOne({ id: data.user_id });
    return response('Phone created', phone, user, null);
  },

  update: async (id, data, params) => {
    await Phone.update(data.data, { where: { id } });
    const response = await Phone.findOne({ where: { id } });
    return response ? response('Phone updated', response, {}, null) : response;
  },

  remove: async (id, params) => {
    await User.update({ phone_id: null }, { where: { phone_id: id } });
    const phone = await Phone.destroy({ where: { id } });
    if (phone === 0) {
      throw new Error(`Phone with id ${id} not found`);
    }
    return null;
  }
});

module.exports = function(app) {
  const Model = createPhoneModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'phones',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/phones', phoneService(options.Model, createUserModel(app)));
  // @TODO find later to paginate phone request
  app.use('/phones', createService(options));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('phones');

  service.hooks(hooks);
};
