require('module-alias/register');
const { jwtHelpers, response } = require('@helpers');
const {
  users: User,
  access_tokens: AccessToken,
  employees: Employee,
  companies: Company
} = require('@models');
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
    const expires = 24 * 60 * 60;

    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: data.email_phone }, { phone: data.email_phone }]
        },
        include: [
          {
            model: Employee,
            attributes: ['id', 'flag', 'role'],
            include: [{ model: Company, attributes: ['id'] }]
          }
        ]
      });

      if (user === null) {
        return res.status(400).json(response(false, 'User not found!'));
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

      let accessToken = await AccessToken.findOne({
        where: {
          [Op.and]: [{ user_id: user.id }, { provider: data.provider }]
        }
      });

      if (crypt.compareSync(data.password, user.password)) {
        const token = jwtHelpers.createJWT(
          Object.assign({
            email: user.email,
            phone: user.phone,
            id: user.id,
            employeeId: user.employees[0].id
          }),
          config.authentication.secret,
          expires
        );
        const payload = {
          access_token: token,
          refresh_token: jwtHelpers.refreshToken(),
          provider: data.provider,
          user_id: user.id,
          expiry_in: expires
        };

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
          },
          include: [{ model: User, as: 'user' }]
        });

        accessToken = Object.assign({}, accessToken.dataValues, {
          company_id: user.employees[0].company.id,
          employee_id: user.employees[0].id,
          flag: user.employees[0].flag,
          role: user.employees[0].role
        });

        if (!accessToken) {
          return res.status(400).json(response(false, 'Login failed'));
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

  update: async (req, res) => {
    const { data } = req.body;
    const expires = 24 * 60 * 60;

    try {
      let accessToken = await AccessToken.findOne({
        where: { refresh_token: data.refresh_token }
      });
      if (!accessToken) {
        return res
          .status(400)
          .json(
            response(false, 'invalid refresh token or access token not found')
          );
      }

      const user = await User.findOne({ where: { id: accessToken.user_id } });

      const token = jwtHelpers.createJWT(
        Object.assign({
          email: user.email,
          phone: user.phone,
          id: user.id,
          full_name: user.full_name
        }),
        config.authentication.secret,
        expires
      );
      const payload = {
        access_token: token,
        refresh_token: jwtHelpers.refreshToken(),
        expiry_in: expires
      };

      accessToken = await AccessToken.update(payload, {
        where: { refresh_token: data.refresh_token }
      });
      accessToken = await AccessToken.findOne({
        where: { user_id: user.id }
      });

      return res
        .status(200)
        .json(response(true, 'Access token successfully updated', accessToken));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  remove: async (id, params) => {
    //
  }
};

module.exports = accessTokenService;
