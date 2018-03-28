require('module-alias/register');
const { jwtHelpers, response } = require('@helpers');
const { users: User, access_tokens: AccessToken } = require('@models');
const crypt = require('bcrypt');
const config = require('config');

const accessTokenService = {
  get: async (req, res) => {
    const { token } = req.headers;
    try {
      const accessToken = await AccessToken.findOne({
        where: { token: token }
      });
      return res
        .status(200)
        .json(response(true, 'Access token retrieved', accessToken, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    const { data } = req.body;

    try {
      const user = await User.findOne({ where: { email: data.email } });

      if (user === null) {
        return res.status(400).json(response(false, 'User email not found!'));
      }

      if (crypt.compareSync(data.password, user.password)) {
        const token = jwtHelpers.createJWT(
          Object.assign({
            email: user.email,
            id: user.id,
            full_name: user.full_name
          }),
          config.authentication.secret
        );
        const payload = {
          access_token: token,
          refresh_token: jwtHelpers.refreshToken(),
          provider: data.provider,
          user_id: user.id
        };
        const accessToken = await AccessToken.findOrCreate({
          where: { user_id: user.id },
          defaults: payload
        });
        if (!accessToken) {
          return res.status(400).json(response(true, 'Login failed'));
        }

        return res
          .status(200)
          .json(
            response(
              true,
              'Login successfully',
              accessToken.length > 0 ? accessToken[0] : accessToken,
              null
            )
          );
      }

      return res.status(422).json(response(false, 'Password mismatch'));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  update: async (id, data, params) => {
    //
  },

  remove: async (id, params) => {
    //
  }
};

module.exports = accessTokenService;
