require('module-alias/register');
const { response, compareCoordinates } = require('@helpers');
const {
  users: User,
  notifications: Notification,
  employees: Employee,
  companies: Company,
  company_settings: CompanySetting,
  digital_assets: DigitalAsset,
  presences: Presence,
  journals: Journal
} = require('@models');
const crypt = require('bcrypt');
const path = require('path');
const config = require('config');
const fs = require('fs');
const Sequelize = require('sequelize');

const meService = {
  // find: async (req, res) => {
  //   const { id: userId } = res.local.users;
  //   try {
  //     const userData = await User.findOne({ where: { id: userId } });
  //     const familyData = await UserFamily.findOne({
  //       where: { user_id: userId }
  //     });
  //     const occupationData = await Occupation.findOne({
  //       where: { user_id: userId }
  //     });
  //     if (!userData || !occupationData || !familyData) {
  //       return res
  //         .status(400)
  //         .json(response(false, `Me data with id ${userId} is not found`));
  //     }
  //     const meData = {
  //       userData,
  //       family: familyData,
  //       occupation: occupationData
  //     };

  //     return res
  //       .status(200)
  //       .json(response(true, 'Me data retrieved successfully', meData, null));
  //   } catch (error) {
  //     if (error.errors) {
  //       return res.status(400).json(response(false, error.errors));
  //     }
  //     return res.status(400).json(response(false, error.message));
  //   }
  // },

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

  deposit: async (req, res) => {
    const { id: userId } = res.local.users;
    const { month, year } = req.query;

    const employeeId = await Employee.findAll({
      where: {
        user_id: userId
      },
      attributes: ['id']
    });

    const getEmployeeId = employeeId[0].dataValues.id;

    try {
      const workhour = await Presence.findAll({
        where: { employee_id: getEmployeeId },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('work_hours')), 'workhour']
        ]
      });

      const presenceData = await Presence.findAll({
        where: { employee_id: getEmployeeId },
        attributes: {
          exclude: ['checkin_location', 'checkuout_location']
        }
      });

      const journalData = await Journal.findAll({
        where: { employee_id: getEmployeeId },
        attributes: [
          'type',
          'debet',
          'kredit'
          // 'description'
        ]
      });

      const salary = await Employee.findAll({
        where: { user_id: userId },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('salary')), 'salaries']]
      });

      const employeeData = await Employee.findAll({
        where: { user_id: userId },
        attributes: ['flag']
      });

      const userData = await User.findAll({
        where: { id: userId },
        attributes: ['full_name', 'email', 'phone']
      });

      const result = {
        id: userId,
        full_name: userData[0]['full_name'],
        email: userData[0]['email'],
        phone: userData[0]['phone'],
        flag: employeeData[0]['flag'],

        salary_summary: {
          month: month,
          year: year,
          net_salary: salary[0].dataValues.salaries,
          mtd_gross_salary:
            workhour[0].dataValues.workhour * salary[0].dataValues.salaries,
          monthly_gross_salary:
            workhour[0].dataValues.workhour * salary[0].dataValues.salaries,
          workhour: workhour[0].dataValues.workhour
        },
        presences: {
          presence_date: presenceData[0].presence_date,
          presence_start: presenceData[0].presence_start,
          presence_end: presenceData[0].presence_end,
          rest_start: presenceData[0].rest_start,
          rest_end: presenceData[0].rest_end,
          presence_overdue: presenceData[0].presence_overdue,
          is_absence: presenceData[0].is_absence,
          is_leave: presenceData[0].is_leave,
          overwork: presenceData[0].overwork,
          work_hours: presenceData[0].work_hours,
          journal: { journalData }
        }
      };

      return res
        .status(200)
        .json(
          response(
            true,
            'Deposit summary list been successfully retrieved',
            result
          )
        );
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
  },

  checklog: async (req, res) => {
    const { id: user_id } = res.local.users;
    const presencesLocation = req.body.location.replace(/\s/g, '').split(',');
    const host =
      process.env.NODE_ENV !== 'production'
        ? `http://${config.host}:${config.port}/`
        : `http://${config.host}/`;

    let filepath;
    let presenceProcess;
    let payload = {
      type: req.body.type,
      uploadable_type: 'employees'
    };

    try {
      const employeeData = await Employee.findOne({
        where: { user_id },
        include: [
          {
            model: Company,
            include: [{ model: CompanySetting, as: 'setting' }]
          }
        ]
      });
      const companyLocation = employeeData.company.location
        .replace(/\s/g, '')
        .split(',');
      const radius = compareCoordinates(
        presencesLocation[0],
        presencesLocation[1],
        companyLocation[0],
        companyLocation[1]
      );

      if (parseFloat(radius) >= 201) {
        return res
          .status(400)
          .json(
            response(
              false,
              'Your checklog not in the right place as company place'
            )
          );
      }

      // This will handle file as encoded base64 from client
      if (!req.file) {
        const base64Data = req.body.file.replace(
          /^data:image\/png;base64,/,
          ''
        );
        const filename = Date.now() + '.png';

        filepath = path.join(
          __dirname + '/../../../public/uploads/' + filename
        );

        fs.writeFile(filepath, base64Data, 'base64', error => {
          if (error) {
            return new Error(
              'Something went wrong when save your image! Please try again.'
            );
          }
        });
        payload['filename'] = filename;
        payload['mime_type'] = 'image/png';
        payload['path'] = 'public/uploads/' + filename;
        payload['url'] = host + 'uploads/' + filename;
      }

      // This will handle file as blob from client
      if (req.file) {
        filepath = req.file.path.split('/')[1];

        payload['path'] = req.file.path;
        payload['filename'] = req.file.filename;
        payload['mime_type'] = req.file.mimetype;
        payload['url'] = `${host}${filepath}/${req.file.filename}`;
      }

      payload['uploadable_id'] = employeeData.id;
      const digitalAsset = await DigitalAsset.create(payload);
      if (!digitalAsset) {
        return res
          .status(400)
          .json(
            response(
              false,
              'Sorry, photo image uploaded but not saved in the database'
            )
          );
      }

      const thisDate = new Date();
      if (req.body.type.toString() === 'checkin') {
        presenceProcess = await Presence.findOne({
          where: {
            employee_id: employeeData.id,
            presence_date: `${thisDate.getFullYear()}-${thisDate.getMonth() +
              1}-${thisDate.getDate()}`
          }
        });
        if (presenceProcess) {
          return res
            .status(400)
            .json(response(false, 'You have already checkin today'));
        }
        presenceProcess = await Presence.create({
          employee_id: employeeData.id,
          presence_date: `${thisDate.getFullYear()}-${thisDate.getMonth() +
            1}-${thisDate.getDate()}`,
          presence_start: thisDate,
          checkin_location: req.body.location
        });
      } else if (req.body.type.toString() === 'checkout') {
        presenceProcess = await Presence.findOne({
          where: {
            employee_id: employeeData.id,
            presence_date: `${thisDate.getFullYear()}-${thisDate.getMonth() +
              1}-${thisDate.getDate()}`
          }
        });
        if (!presenceProcess) {
          return res
            .status(400)
            .json(response(false, 'Please do checkin first'));
        }
        // For testing checkout time purpose, uncomment below
        // Date.prototype.addHours = function(h) {
        //   this.setHours(this.getHours() + h);
        //   return this;
        // };
        const checkining = new Date(presenceProcess.presence_start);
        const work_hours = Math.floor(Math.abs(checkining - thisDate) / 36e5);
        const overwork = Math.floor(
          work_hours - employeeData.company.setting.overwork_limit
        );
        presenceProcess = await Presence.update(
          {
            presence_end: thisDate,
            checkout_location: req.body.location,
            overwork,
            work_hours
          },
          {
            where: {
              employee_id: employeeData.id,
              presence_date: `${thisDate.getFullYear()}-${thisDate.getMonth() +
                1}-${thisDate.getDate()}`
            }
          }
        );
      }
      return res
        .status(201)
        .json(response(true, 'You have been successfully checking'));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = meService;
