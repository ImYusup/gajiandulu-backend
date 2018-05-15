require('module-alias/register');
const { response } = require('@helpers');
const {
  journals: Journals,
  employees: Employee,
} = require('@models');
const Sequelize = require('sequelize');

const dashboardService = {
  get: async (req, res) => {
    const { month: month } = req.query;
    const { year: year } = req.query;
    const { id: companyId } = req.params;

    try {
      const total_salary = await Employee.findAll({
        where: { company_id: companyId },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('salary')), 'total_salaries']],
      });
      const deposits = await Employee.findAll({
        attributes: ['company_id'],
        where: { company_id: companyId },
        raw: true,
        include: [{
          model: Journals,
          attributes: [[Sequelize.fn('SUM', (Sequelize.col('debet'), Sequelize.literal('-'), Sequelize.col('kredit'))), 'deposit']],
          raw: true
        }],
      });

      const payload = Object.assign({}, {
        id: companyId,
        month: month,
        year: year,
        total_salary: total_salary[0].dataValues.total_salaries,
        deposit: deposits[0]['journals.deposit'],
      });
      return res
        .status(200)
        .json(
          response(
            true,
            'Deposit summary has been successfully retrieved',
            payload,
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

module.exports = dashboardService;
