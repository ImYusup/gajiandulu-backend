require('module-alias/register');
//console.log('luffy');
const { response } = require('@helpers');
const {
  //journals: Journals,
  employees: Employee,
  users: User,
  presences: Presence,
  journals: Journal
} = require('@models');
//const Sequelize = require('sequelize');
var d = new Date();
var Month = d.getMonth() + 1;
var Year = d.getFullYear();

// function totalData(presenceDatas) {
//   let salaryTot = 0;
//   let date = [];
//   for (let i = 0; i < presenceDatas.length; i++) {
//     date.push(presenceDatas[i].dataValues.presence_date.split('-'));
//     salaryTot = salaryTot + presenceDatas[i].dataValues.salary;
//   }
//   return date;
// }

function totalWorkhour(presenceDatas) {
  let i = 0;
  let dateNow = new Date();
  let wHours = 0;
  let a;
  let a2;
  let b = dateNow.getMonth() + 1;
  let b2 = dateNow.getFullYear();
  for (i = 0; i < presenceDatas.length; i++) {
    a = presenceDatas[i].dataValues.presence_start.getMonth() + 1;
    a2 = presenceDatas[i].dataValues.presence_start.getFullYear();
    if (b === a && b2 === a2) {
      wHours = wHours + presenceDatas[i].dataValues.work_hours;
    }
  }
  return wHours;
}

const companyMemberService = {
  get: async (req, res) => {
    const { company_id: companyId } = req.params;

    try {
      const journalData = await Journal.findAll({
        where: { employee_id: companyId }
      });
      const presenceData = await Presence.findAll({
        where: { employee_id: companyId }
      });
      const employeeData = await Employee.findAll({
        where: { company_id: companyId }
      });
      const userData = await User.findAll({
        where: { id: companyId }
      });

      let presences = totalWorkhour(presenceData);
      const payload = Object.assign(
        {},
        {
          id: companyId,
          full_name: userData[0].dataValues.full_name,
          email: userData[0].dataValues.email,
          phone: userData[0].dataValues.phone,
          flag: employeeData[0].dataValues.flag,
          role: employeeData[0].dataValues.role,
          salary_summary: {
            month: Month,
            year: Year,
            salary: journalData[0].dataValues.kredit,
            fine: journalData[0].dataValues.debet,
            workhour: presences
          }
        }
      );

      return res
        .status(200)
        .json(
          response(true, 'Member list been successfully retrieved', payload)
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = companyMemberService;
