const crypt = require('bcrypt');
const createAccessToken = require('../../models/access.tokens.model.js');
const createUserModel = require('../../models/users.model.js');
const jwtHelpers = require('../helpers.js');
const hooks = require('./access.tokens.hooks');
const response = require('../response');

const accessTokenService = (AccessToken, User, secret) => ({
  find: async params => {},

  get: async (id, params) => {
    const accessToken = await AccessToken.findOne({ where: { id } });
    return response('Access token retrieved', accessToken, {}, null);
  },

  create: async ({ data }, params) => {
    const user = await User.findOne({ where: { email: data.email } });
    if (user === null) {
      throw new Error('User email not found!');
    }

    if (crypt.compareSync(data.password, user.password)) {
      const token = jwtHelpers.createJWT(
        Object.assign({
          email: user.email,
          id: user.id,
          full_name: user.full_name
        }),
        secret
      );
      const payload = {
        access_token: token,
        refresh_token: jwtHelpers.refreshToken(),
        provider: data.provider,
        user_id: user.id
      };
      console.log('TOKEN', token);
      const accessToken = await AccessToken.create(payload);
      return response('Login', accessToken, user, null);
    }

    return new Error('Password mismatch');
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
  app.use(
    '/login',
    accessTokenService(
      createAccessToken(app),
      createUserModel(app),
      app.get('authentication').secret
    )
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('login');

  service.hooks(hooks);
};
