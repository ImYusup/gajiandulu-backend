require('module-alias/register');
const { response } = require('@helpers');
const {
  users: User,
  occupations: Occupation,
  families: UserFamily,
  notifications: Notification
} = require('@models');
const crypt = require('bcrypt');

const meService = {
  find: async (req, res) => {
    const { id: userId } = res.local.users;
    try {
      const userData = await User.findOne({ where: { id: userId } });
      const familyData = await UserFamily.findOne({
        where: { user_id: userId }
      });
      const occupationData = await Occupation.findOne({
        where: { user_id: userId }
      });
      if (!userData || !occupationData || !familyData) {
        return res
          .status(400)
          .json(response(false, `Me data with id ${userId} is not found`));
      }
      const meData = {
        userData,
        family: familyData,
        occupation: occupationData
      };

      return res
        .status(200)
        .json(response(true, 'Me data retrieved successfully', meData, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  patch: async (req, res) => {
    const { id: userId } = res.local.users;
    const { data } = req.body;
    try {
      const userData = await User.findOne({ where: { id: userId } });
      if (!userData) {
        return res
          .status(400)
          .json(response(false, `User data with id ${userId} is not found`));
      }

      // Update User Data
      const users = Object.assign({}, data);
      if (users.old_password) {
        if (crypt.compareSync(users.old_password, userData.password)) {
          const encryptPassword = crypt.hashSync(users.new_password, 15);
          const usersWithPassword = Object.assign(
            {},
            users,
            { password: encryptPassword },
            delete users.old_password,
            delete users.new_password
          );
          await User.update(usersWithPassword, { where: { id: userId } });
        } else {
          return res
            .status(400)
            .json(response(false, 'Old password is incorrect'));
        }
      } else {
        await User.update(users, { where: { id: userId } });
      }

      return res
        .status(200)
        .json(response(true, 'Profile has been successfully updated'));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['id', 'employee_id', 'updated_at'] }
      });
      if (!notifications) {
        return res.status(400).json(response(false, 'Notifications not found'));
      }

      return res
        .status(200)
        .json(
          response(
            true,
            'Notifications has been successfully retrieved',
            notifications
          )
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = meService;
