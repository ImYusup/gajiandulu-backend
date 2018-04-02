require('module-alias/register');
const { jwtHelpers, response } = require('@helpers');
const { users: User, access_tokens: AccessToken } = require('@models');
const crypt = require('bcrypt');
const config = require('config');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

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

      if (!user.registration_complete) {
        return res
          .status(400)
          .json(response(false, 'Please complete your registration first!'));
      }

      // @TODO Uncomment this when email service activated
      // if (!user.is_confirmed_email) {
      //   return res
      //     .status(400)
      //     .json(response(false, 'We sent you an email confirmation, please do confirm your email first!'));
      // }

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

        let accessToken = await AccessToken.findOne({
          where: {
            [Op.and]: [{ user_id: user.id }, { provider: data.provider }]
          }
        });

        if (!accessToken) {
          await AccessToken.create(payload);
        } else {
          await AccessToken.update(payload, {
            where: {
              [Op.and]: [{ user_id: user.id }, { provider: data.provider }]
            }
          });
        }

        accessToken = await AccessToken.findOne({
          where: {
            [Op.and]: [{ user_id: user.id }, { provider: data.provider }]
          }
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
