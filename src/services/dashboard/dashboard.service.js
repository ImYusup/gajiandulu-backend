require('module-alias/register');
const { response } = require('@helpers');
const {
  journals: Journals,
  employees: Employee,
  companies: Company
} = require('@models');
const Sequelize = require('sequelize');

const dashboardService = {
  get: async (req, res) => {
    const { data } = req.body;
    const { month: month } = req.params;
    const { year: year } = req.params;
    const { id: companyId } = req.params;

    try {
      let company = await Company.findAll({
        attributes: ['Company.*', 'Employee.*', 'Journals.*' [Sequelize.fn('COUNT', Sequelize.col('Employee.salary')), 'total_salary']],
        include: [{
          model: Employee,
          include: [{
            model: Journals,
            where: { month: month, year: year, id: companyId  },
          }],
          }],
      }).then(results => {
        if (!results) {
          return res
            .status(400)
            .json(response(false, `Company with id ${companyId} is not found`));
        }

        const depositSummary = results.map(data => {
          
          return Object.assign(
            {},
            {
              id: companyId,
              year: year,
              month: month,
              total_salary: data.total_salary ,
              deposit: data.debit - data.kredit,
            },
          );
          res
          .status(200)
          .json(
            response(
                true,
                'Deposit summary has been successfully retrieved',
                depositSummary
            );
          );
        });
      });

    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = dashboardService;
