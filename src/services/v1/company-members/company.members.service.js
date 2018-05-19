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

function companyMembersData(
  journalData,
  presenceData,
  employeeData,
  userData,
  Year,
  Month,
  Employee,
  Journal
) {
  let members = [];
  let i = 0;
  let dateNow = new Date();
  let wHours = 0;
  let a;
  let a2;
  let b = dateNow.getMonth() + 1;
  let b2 = dateNow.getFullYear();
  for (i = 0; i < employeeData.length; i++) {
    var x = employeeData[i].dataValues.user_id;
    var y = employeeData[i].dataValues.id;
    var full_name = userData[x - 1].dataValues.full_name;
    var email = userData[x - 1].dataValues.email;
    var phone = userData[x - 1].dataValues.phone;
    var flag = employeeData[i].dataValues.flag;
    var role = employeeData[i].dataValues.role;
    var kredit = journalData[y - 1].dataValues.kredit;
    var debet = journalData[y - 1].dataValues.debet;
    a = presenceData[x - 1].dataValues.presence_start.getMonth() + 1;
    a2 = presenceData[x - 1].dataValues.presence_start.getFullYear();
    if (b === a && b2 === a2) {
      wHours = wHours + presenceData[x - 1].dataValues.work_hours;
    }

    members.push({
      id: employeeData[i].dataValues.company_id,
      full_name: full_name,
      email: email,
      phone: phone,
      flag: flag,
      role: role,
      salary_summary: {
        month: Month,
        year: Year,
        salary: kredit,
        fine: debet,
        workhour: x,
        wHours
      }
    });
  }
  return members;
}
const companyMemberService = {
  get: async (req, res) => {
    const { company_id: companyId } = req.params;

    try {
      const journalData = await Journal.findAll({});
      const presenceData = await Presence.findAll({});
      const employeeData = await Employee.findAll({
        where: { company_id: companyId }
      });
      const userData = await User.findAll({});

      //       HASIL TAUFAN :

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
      //             }//
      //         }
      //     ]
      // }

      let dataMem = companyMembersData(
        journalData,
        presenceData,
        employeeData,
        userData,
        Year,
        Month
      );

      const payload = dataMem;

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
