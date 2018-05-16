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
    const { month: month } = req.query;
    const { year: year } = req.query;
    const { id: userId } = req.params;


    try {
      const fines = await Presence.findAll({
        where: { employee_id: userId },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('fine')), 'fines']],

      });
      const workhour = await Presence.findAll({
        where: { employee_id: userId },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('work_hours')), 'workhour']],

      });

      const presenceData = await Presence.findAll({
        where: { employee_id: userId },
        attributes: ['presence_date', 'presence_start', 'presence_end', 'rest_start', 'rest_end', 'presence_overdue', 'is_absence', 'is_leave', 'overwork', 'work_hours', 'fine'],

      });

      const salary = await Employee.findAll({
        where: { user_id: userId },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('salary')), 'salaries']],
      });

      const employeeData = await Employee.findAll({
        where: { user_id: userId },
        attributes: ['flag'],
      });

      const userData = await User.findAll({
        where: { id: userId },
        attributes: ['full_name', 'email', 'phone'],
      });

      const memberData = Object.assign({}, {
        id: userId,
        full_name: userData[0]['full_name'],
        email: userData[0]['email'],
        phone: userData[0]['phone'],
        flag: employeeData[0]['flag'],

        salary_summary: {
          month: month,
          year: year,
          total_salary: salary[0].dataValues.salaries,
          fine: fines[0].dataValues.fines,
          workhour: workhour[0].dataValues.workhour,
        },

        presences: presenceData,
      });

      return res
        .status(200)
        .json(
          response(
            true,
            'Member list been successfully retrieved',
            memberData,
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

module.exports = memberService;
