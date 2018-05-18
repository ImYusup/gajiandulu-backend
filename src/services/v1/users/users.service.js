require('module-alias/register');
const { response, jwtHelpers } = require('@helpers');
const { users: User, access_tokens: AccessToken } = require('@models');
const axios = require('axios');
const crypt = require('bcrypt');
const config = require('config');
// const Sequelize = require('sequelize');
// const { Op } = Sequelize;

const userService = {
  find: async (req, res) => {
    try {
      const user = await User.all();
      return res
        .status(200)
        .json(response(true, 'User retrieved successfully', user, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (user === null) {
        return res
          .status(400)
          .json(response(false, `User with id ${userId} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'User retrieved successfully', user, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  /**
   * Save user to database
   *
   */
  create: async (req, res) => {
    const { password, email, full_name, birthday } = req.body;
    try {
      // second parameter is salt for hash
      const hashPassword = crypt.hashSync(password, 15);
      const hash = crypt.hashSync(new Date().toString() + email, 10);
      // Additional requirement:
      // if user is not completed their registration step delete the all user related record
      // and created new user
      const payload = Object.assign(
        {},
        {
          full_name,
          email,
          birthday,
          password: hashPassword,
          hash
        }
      );
      let user = await User.findOne({ where: { email: email } });
      if (user) {
        // this should do cascade delete on associate models
        if (!user.registration_complete) {
          await User.update(payload, { where: { email: email } });
          user = await User.findOne({ where: { email: email } });
          return res
            .status(200)
            .json(
              response(
                true,
                'Invited user has been registered successfully',
                user
              )
            );
        } else {
          return res
            .status(422)
            .json(
              response(
                false,
                'You have completed registration process please do login!'
              )
            );
        }
      } else {
        user = await User.create(payload);
        return res
          .status(201)
          .json(response(true, 'User has been registered successfully', user));
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  /**
   * Update user phone data
   * Check if hash same with stored one
   *
   */
  patch: async (req, res) => {
    const userId = req.params.id;
    const { data } = req.body;
    try {
      let user = await User.findOne({ where: { id: userId } });
      if (user === null) {
        res
          .status(400)
          .json(response(false, `User with id ${userId} not found`));
      }
      // Hash checking
      if (user.hash !== data.hash) {
        return res.status(422).json(response(false, 'Hash is mismatched'));
      }
      const updatedUser = await User.update(data, { where: { id: userId } });
      if (updatedUser[0] === 0) {
        return res.status(400).json(response(false, 'User update was failed'));
      }

      user = await User.findOne({ where: { id: userId } });

      return res
        .status(200)
        .json(response(true, 'User updated successfully', user, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  /**
   * Check authorization_code from account kit client
   * if the authorization_code valid facebook graph should return
   * access token
   *
   */
  put: async (req, res) => {
    const { data } = req.body;

    const { user_id: userId } = data;
    try {
      let user = await User.findOne({ where: { id: userId } });
      if (user === null) {
        return res
          .status(400)
          .json(response(false, `User with id ${userId} not found`));
      }
      // Hash checking
      if (user.hash !== data.hash) {
        return res.status(404).json(response(false, 'Hash is mismatched'));
      }

      // Check authorization code to facebook graph server
      const {
        clientID,
        clientSecret,
        graphUri
      } = config.authentication.facebook;

      const fbAccessToken = await axios.get(
        `${graphUri}/access_token?grant_type=authorization_code&code=${
          data.authorization_code
        }&access_token=AA|${clientID}|${clientSecret}`
      );

      if (!fbAccessToken || fbAccessToken.error) {
        return res.status(512).json(response(false, fbAccessToken.error));
      }

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
        provider: 'account-kit',
        user_id: user.id
      };
      const accessToken = await AccessToken.create(payload);

      if (accessToken) {
        return res
          .status(200)
          .json(
            response(true, 'Phone number validation success', accessToken, user)
          );
      }
      return res.status(422).json(response(false, 'Unprocessable entity'));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  remove: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.destroy({ where: { id: userId } });
      if (user === 0) {
        return res
          .status(400)
          .json(response(false, `User with id ${userId} not found`));
      }
      return null;
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = userService;
