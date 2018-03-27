require('module-alias/register');
const { response } = require('@helpers');
const { users: User, access_tokens: AccessToken } = require('@models');
const axios = require('axios');
const crypt = require('bcrypt');
const config = require('config');

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
    const { password, email, full_name, date_of_birth } = req.body;
    try {
      // second parameter is salt for hash
      const hashPassword = crypt.hashSync(password, 15);
      const hash = crypt.hashSync(new Date().toString() + email, 10);
      const payload = Object.assign(
        {},
        {
          full_name,
          email,
          date_of_birth,
          password: hashPassword,
          hash
        }
      );

      const user = await User.create(payload);
      return res
        .status(201)
        .json(
          response(true, 'User has been registered successfully', user, null)
        );
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
      const { clientID, clientSecret, graphUri } = config.facebook;
      const accountKitResponse = await axios.get(
        `${graphUri}access_token?grant_type=authorization_code&code=${
          data.authorization_code
        }&access_token=AA${clientID}${clientSecret}`
      );
      console.log("THIS ISSSSSSSSSS = ", data)
      
      if (accountKitResponse) {
        const payload = {
          access_token: accountKitResponse.access_token,
          refresh_token: accountKitResponse.token_refresh_interval_sec,
          provider: 'account-kit',
          user_id: user.id
        };
        const accessToken = await AccessToken.create(payload);
        return res
          .status(200)
          .json(response(true, 'Pin validation success', accessToken, user));
      }

      return res.status(422).json(response(false, 'Pin validation failed'));
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
