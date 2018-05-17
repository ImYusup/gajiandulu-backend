require('module-alias/register');
const { response } = require('@helpers');
const {
  employees: Employee,
  users: User,
  presences: Presence
} = require('@models');
const Sequelize = require('sequelize');

const memberService = {
  get: async (req, res) => {
    const { id: userId } = req.params;

    try {
      const fines = await Presence.findAll({
        where: { employee_id: userId },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('fine')), 'fines']]
      });

      const month = await Presence.findAll({
        where: { employee_id: userId },
        attributes: [
          [Sequelize.fn('month', Sequelize.col('presence_date')), 'month']
        ]
      });

      const year = await Presence.findAll({
        where: { employee_id: userId },
        attributes: [
          [Sequelize.fn('year', Sequelize.col('presence_date')), 'year']
        ]
      });

      const workhour = await Presence.findAll({
        where: { employee_id: userId },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('work_hours')), 'workhour']
        ]
      });

      const presenceData = await Presence.findAll({
        where: { employee_id: userId },
        attributes: [
          'presence_date',
          'presence_start',
          'presence_end',
          'rest_start',
          'rest_end',
          'presence_overdue',
          'is_absence',
          'is_leave',
          'overwork',
          'work_hours',
          'fine'
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

      const memberData = Object.assign(
        {},
        {
          id: userId,
          full_name: userData[0]['full_name'],
          email: userData[0]['email'],
          phone: userData[0]['phone'],
          flag: employeeData[0]['flag'],

          salary_summary: {
            month: month[0].dataValues.month,
            year: year[0].dataValues.year,
            total_salary: salary[0].dataValues.salaries,
            fine: fines[0].dataValues.fines,
            workhour: workhour[0].dataValues.workhour
          },

          presences: presenceData
        }
      );

      return res
        .status(200)
        .json(
          response(true, 'Member list been successfully retrieved', memberData)
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  patch: async (req, res) => {
    const userId = req.params.id;
    const { data } = req.body;
    try {
      let employee = await Employee.findOne({ where: { id: userId } });

      Employee.update(data, { where: { id: userId } });
      if (employee.flag == '3') {
        return res
          .status(200)
          .json(response(true, 'Member status has been successfully updated'));
      }
      return res.status(400).json(response(false));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    const { data } = req.body;
    const { company_id } = req.params;
    //console.log(data);
    // res.local.users from auth middleware
    // check src/helpers/auth.js

    try {
      const emailExist = await User.findOne({
        where: { email: data.email }
      });
      if (emailExist) {
        const payload = Object.assign(
          {},
          data,
          delete data.name,
          delete data.phone,
          delete data.email,
          { user_id: emailExist.id, company_id, active: true }
        );
        const employee = await Employee.create(payload);
        return res
          .status(201)
          .json(
            response(
              true,
              'Employee has been added successfully',
              employee,
              null
            )
          );
      } else {
        const payload = Object.assign({}, data, { active: true });

        const user = await User.create(payload);
        //const employee = await Employee.create(payload1);

        return res
          .status(201)
          .json(
            response(
              true,
              'User & Employee has been added successfully',
              user,
              null
            )
          );
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = memberService;
