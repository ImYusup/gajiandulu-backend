require('module-alias/register');
const { response } = require('@helpers');
const { users: User } = require('@models');
const crypt = require('bcrypt');

const forgotPasswordService = {
  /**
   * Forgot password
   *
   */
  create: async (req, res) => {
    const { password, email, hash } = req.body;

    try {
      const user = await User.findOne({ where: { email: email } });
      const hashPassword = crypt.hashSync(password, 15);

      if (user === null) {
        return res.status(400).json(response(false, 'User email not found!'));
      }

      if (crypt.compareSync(hash, user.hash)) {
        await User.update(
          {
            password: hashPassword
          },
          { where: { email: email, hash: hash } }
        );
        return res
          .status(200)
          .json(
            response(
              true,
              'Password successfully reset, please check your email'
            )
          );
      }

      return res.status(422).json(response(false, 'Date of birth mismatch'));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = forgotPasswordService;
