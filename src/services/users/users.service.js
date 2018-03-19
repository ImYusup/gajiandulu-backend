const axios = require('axios');
const createUserModel = require('../../models/users.model');
const createAccessToken = require('../../models/access.tokens.model.js');
const hooks = require('./users.hooks.js');
const response = require('../response');

const userService = (User, facebook, AccessToken) => ({
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

  /**
   * Update user phone data
   * Check if hash same with stored one
   *
   * @param  {INTEGER}  id
   * @param  {OBJECT}  data
   * @param  {OBJECT}  params
   * @return {Mixed}
   */
  patch: async (id, data, params) => {
    let user = await User.findOne({ where: { id: id } });
    if (user === null) {
      return response(false, `User with id ${id} not found`);
    }
    // Hash checking
    if (user.hash !== data.data.hash) {
      return response(false, 'Hash is mismatched');
    }
    const updatedUser = await User.update(data.data, { where: { id: id } });
    if (updatedUser[0] === 0) {
      return response(false, 'User update was failed');
    }

    user = await User.findOne({ where: { id: id } });

    return response(true, 'User updated successfully', user, null);
  },

  update: async (id, data, param) => {
    let user = await User.findOne({ where: { id: id } });
    if (user === null) {
      return response(false, `User with id ${id} not found`);
    }
    // Hash checking
    if (user.hash !== data.data.hash) {
      return response(false, 'Hash is mismatched');
    }
    // Check pin to facebook graph server
    const { clientID, clientSecret, graphUri } = facebook;

    const response = await axios.get(
      `${graphUri}access_token?grant_type=authorization_code&code=${
        data.pin
      }&access_token=${clientID}${clientSecret}`
    );

    const payload = {
      access_token: response.access_token,
      refresh_token: response.token_refresh_interval_sec,
      provider: 'account-kit',
      user_id: user.id
    };
    const accessToken = await AccessToken.create(payload);
    return response(true, 'Pin validation success', accessToken, user);
  },

  remove: async (id, params) => {
    const user = await User.destroy({ where: { id: id } });
    if (user === 0) {
      throw new Error(`User with id ${id} not found`);
    }
    return null;
  }
});

module.exports = function(app) {
  app.use(
    '/users',
    userService(
      createUserModel(app),
      app.get('facebook'),
      createAccessToken(app)
    )
  );
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users');

  service.hooks(hooks);
};
