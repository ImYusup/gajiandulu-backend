require('module-alias/register');
const { response } = require('@helpers');
const {
  employees: Employee,
  users: User,
  presences: Presence,
  journals: Journal
} = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const companyMemberService = {
  get: async (req, res) => {
    const { company_id: companyId } = req.params;

    try {
      const dateNow = new Date();
      const firstDateThisMonth = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        1
      );
      const year = dateNow.getFullYear();
      const month = dateNow.getMonth() + 1;

      const userData = await User.findAll({
        attributes: ['id', 'full_name', 'email', 'phone'],
        include: [
          {
            model: Employee,
            attributes: ['id', 'flag', 'role'],
            where: { company_id: companyId },
            include: [
              {
                model: Journal,
                attributes: ['debet', 'kredit'],
                where: {
                  created_at: {
                    [Op.gte]: firstDateThisMonth,
                    [Op.lte]: dateNow
                  }
                },
                required: false
              },
              {
                model: Presence,
                attributes: ['work_hours'],
                where: {
                  presence_date: {
                    [Op.gte]: firstDateThisMonth,
                    [Op.lte]: dateNow
                  }
                },
                required: false
              }
            ]
          }
        ]
      });

      const members = [];
      userData.forEach(member => {
        let workhours = 0;
        member.employees[0].presences.forEach(presence => {
          workhours += presence['work_hours'];
        });
        let salaries = 0;
        member.employees[0].journals.forEach(journal => {
          salaries += journal['debet'];
          salaries -= journal['kredit'];
        });
        const memberData = Object.assign(
          {},
          {
            id: member.employees[0]['id'],
            full_name: member['full_name'],
            email: member['email'],
            phone: member['phone'],
            flag: member.employees[0]['flag'],
            role: member.employees[0]['role'],
            salary_summary: {
              month: month,
              year: year,
              nett_salary: salaries,
              workhour: workhours
            }
          }
        );
        members.push(memberData);
      });

      return res
        .status(200)
        .json(
          response(true, 'Member list been successfully retrieved', members)
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
