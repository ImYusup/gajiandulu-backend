require('module-alias/register');
//console.log('luffy');
const { response } = require('@helpers');
const {
  //journals: Journals,
  employees: Employee,
  users: User,
  presences: Presence
} = require('@models');
//const Sequelize = require('sequelize');
function totalData(presenceDatas) {
  let salaryTot = 0;
  let date = [];
  for (let i = 0; i < presenceDatas.length; i++) {
    date.push(presenceDatas[i].dataValues.presence_date.split('-'));
    salaryTot = salaryTot + presenceDatas[i].dataValues.salary;
  }
  return date;
}
const companyMemberService = {
  get: async (req, res) => {
    // const { month: month } = req.query;
    // const { year: year } = req.query;
    const { id: userId } = req.params;

    try {
      // punyaku
      const presenceData = await Presence.findAll({
        where: { employee_id: userId }
        // attributes: [[Sequelize.fn(Sequelize.col('full_name')), 'full_name']],
      });
      // console.log(presenceData);
      const employeeData = await Employee.findAll({
        where: { user_id: userId }
        // attributes: [[Sequelize.fn(Sequelize.col('full_name')), 'full_name']],
      });
      const userData = await User.findAll({
        where: { id: userId }
        // attributes: [[Sequelize.fn(Sequelize.col('full_name')), 'full_name']],
      });
      //res.send("full_name : " + full_name[0].dataValues.full_name);
      //console.log(full_name);
      //punya ryan===============================================
      // const total_salary = await Employee.findAll({
      //   where: { company_id: companyId },
      //   attributes: [[Sequelize.fn('SUM', Sequelize.col('salary')), 'total_salaries']],
      // });
      // const deposits = await Employee.findAll({
      //   attributes: ['company_id'],
      //   where: { company_id: companyId },
      //   raw: true,
      //   include: [{
      //     model: Journals,
      //     attributes: [[Sequelize.fn('SUM', (Sequelize.col('debet'), Sequelize.literal('-'), Sequelize.col('kredit'))), 'deposit']],
      //     raw: true
      //   }],
      // });

      // const deposit = await Sequelize.query("SELECT SUM((debet) - (kredit)) AS deposit from `companies` JOIN `employees` ON employees.company_id = companies.id JOIN `journals` ON journals.employee_id = employees.id;",
      // { type: Sequelize.QueryTypes.SELECT});

      // res.send(deposits);
      //var ryan = journals.deposit;
      //console.log("aaaa");

      var totalDatas = totalData(presenceData);
      //console.log (salaryTot);

      //var koko = presenceData[0].dataValues.presence_date.split("-");

      const payload = Object.assign(
        {},
        {
          id: userId,
          //month: month,
          //year: year,
          // total_salary: total_salary[0].dataValues.total_salaries,
          full_name: userData[0].dataValues.full_name,
          email: userData[0].dataValues.email,
          phone: userData[0].dataValues.phone,
          flag: employeeData[0].dataValues.flag,
          role: employeeData[0].dataValues.role,
          //salary_summary: presenceData[1].dataValues,
          salary_summary: {
            month: totalDatas,
            year: 1,
            salary: 1,
            fine: 10000,
            workhour: 60
          }
          // deposit: deposits[0]["journals.deposit"],
        }
      );

      return res
        .status(200)
        .json(
          response(true, 'Member list been successfully retrieved', payload)
        );

      // HASIL TAUFAN =================================================================
      //   {
      //     "success": "true",
      //     "message": "Member list been successfully retrieved",
      //     "data": [
      //         {
      //             "id": "12",
      //             "full_name": "Tony Stark",
      //             "email": "tony@stark.com",
      //             "phone": "0856748394",
      //             "flag": "3",
      //             "role": "2",
      //             "salary_summary": {
      //                 "month": "2",
      //                 "year": "2018",
      //                 "salary": "5000000",
      //                 "fine": "10000",
      //                 "workhour": "60"
      //             }
      //         }
      //     ]
      // }
      // HASIL TAUFAN ==================================================================

      // HASIL RYAN   ==================================================================
      //    {
      //     "success": "true",
      //     "message": "Deposit summary been successfully retrieved",
      //     "data": {
      //         "id": "2",
      //         "year": "2018",
      //         "month": "10",
      //         "total_salary": "2500000"
      //         "deposit": "30000000",
      //     }
      // }
      // HASIL RYAN  ==================================================================

      //.then(results => {
      //   console.log('aaaaaa',results);
      //   if (!results) {
      //     return res
      //       .status(400)
      //       .json(response(false, `Company with id ${companyId} is not found`));
      //   }

      //   const depositSummary = results.map(data => {

      //     return Object.assign(
      //       {},
      //       {
      //         id: companyId,
      //         year: year,
      //         month: month,
      //         total_salary: data.total_salary,
      //         deposit: data.debit - data.kredit,
      //       },
      //       res.status(200)
      //       .json(response(
      //         true,
      //         'Deposit summary has been successfully retrieved',
      //         depositSummary
      //       ))
      //     );
      //   });
      // });
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = companyMemberService;
