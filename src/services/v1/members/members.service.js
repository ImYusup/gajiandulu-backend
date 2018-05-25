require('module-alias/register');
const { response, nodemailerMail } = require('@helpers');
const {
  employees: Employee,
  users: User,
  presences: Presence,
  companies: Company,
  journals: Journal
} = require('@models');
const crypt = require('bcrypt');
require('sequelize');

const memberService = {
  get: async (req, res) => {
    const { id: userId } = req.params;
    const today = new Date();
    const month = ('00' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();

    try {
      const userData = await User.findOne({
        where: { id: userId },
        attributes: ['full_name', 'email', 'phone']
      });
      const { full_name, email, phone } = userData.dataValues;

      const employeeid = await Employee.findOne({
        where: { user_id: userId },
        attributes: ['id', 'salary', 'daily_salary', 'flag']
      });
      const {
        id: employeeId,
        salary,
        daily_salary,
        flag
      } = employeeid.dataValues;

      let presenceData = await Presence.findAll({
        where: {
          employee_id: employeeId
        },
        attributes: {
          exclude: [
            'id',
            'employee_id',
            'checkin_location',
            'checkout_location',
            'created_at',
            'updated_at'
          ]
        }
      });
      presenceData = presenceData.filter(data => {
        let x = data.presence_date.split('-');
        return `${x[0]}-${x[1]}` == `${year}-${month}`;
      });

      const journalData = await Journal.findAll({
        where: { employee_id: employeeId },
        attributes: ['type', 'debet', 'kredit', 'description', 'created_at']
      }).then(res =>
        res.map(x => {
          return x.dataValues;
        })
      );
      journalData.map(data => {
        data['date'] = `${data.created_at.getFullYear()}-${(
          '00' +
          (data.created_at.getMonth() + 1)
        ).slice(-2)}-${data.created_at.getDate()}`;
      });

      let monthlyPresence = [];
      let workhour = 0;
      let debit = 0;
      let credit = 0;
      presenceData.map(async data => {
        workhour += data.work_hours;
        let journal = journalData.filter(fil => {
          return fil.date == data.dataValues.presence_date;
        });
        journal.map(del => {
          debit += del.debet;
          credit += del.kredit;
          delete del.date;
        });
        data.dataValues['journals'] = journal;
        monthlyPresence.push(data);
      });

      const mtd_gross_salary = daily_salary * monthlyPresence.length;
      const nett_salary = mtd_gross_salary + debit - credit;

      const salary_summary = {
        month: month,
        year: year,
        nett_salary: nett_salary,
        mtd_gross_salary: mtd_gross_salary,
        monthly_gross_salary: salary,
        workhour: workhour
      };

      const memberData = {
        id: userId,
        full_name: full_name,
        email: email,
        phone: phone,
        flag: flag,
        salary_summary: salary_summary,
        presences: monthlyPresence
      };

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
      const companyData = await Company.findOne({ where: { id: company_id } });
      if (!companyData) {
        return res
          .status(400)
          .json(
            response(false, `Company with parameter id ${company_id} not found`)
          );
      }
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
        let employee = await Employee.findOne({
          where: { user_id: emailExist.id }
        });
        if (!employee) {
          employee = await Employee.create(payload);
        } else {
          if (employee.flag.toString() === '3') {
            return res
              .status(400)
              .json(
                response(false, 'Inputted email already joined to company')
              );
          }
          await Employee.update(payload, { where: { user_id: emailExist.id } });
        }

        const results = Object.assign({}, { id: employee.id }, data);
        nodemailerMail.sendMail(
          {
            from: 'no-reply@gajiandulu.id',
            to: data.email, // An array if you have multiple recipients.
            subject: `Member Invitation GajianDulu - ${companyData.name}`,
            //You can use "html:" to send HTML email content. It's magic!
            html: `
              <h1>${companyData.name} Member Invitation</h1>
              <p>You have invitation from ${companyData.name}</p>
              <p>The company manager has invited you with these information</p><br>
              <p>Full Name: ${data.name}</p>
              <p>Email: ${data.email}</p>
              <p>Phone: ${data.phone}</p><br>
              <p>Please do register again in GajianDulu Mobile Apps with those information.</p>
              <p>Then you must insert this company codename after you done registration</p>
              <p>--------------------------------------------------------------------------</p>
              <h2>${companyData.codename}</h2>
              <p>--------------------------------------------------------------------------</p>
              `
          },
          function(err, info) {
            if (err) {
              return res
                .status(400)
                .json(
                  response(
                    false,
                    'Failed to send email, please invite member again',
                    err
                  )
                );
            } else {
              return res
                .status(201)
                .json(
                  response(true, 'Employee has invited successfully', results)
                );
            }
          }
        );
      } else {
        const hash = crypt.hashSync(new Date().toString() + data.email, 10);
        const payloadUser = Object.assign(
          {},
          { full_name: data.name, email: data.email, phone: data.phone, hash }
        );
        const userCreated = await User.create(payloadUser);

        const payloadEmployee = Object.assign(
          {},
          {
            company_id,
            user_id: userCreated.id,
            role: data.role,
            salary: data.salary,
            flag: data.flag
          }
        );
        const employee = await Employee.create(payloadEmployee);
        const results = Object.assign({}, { id: employee.id }, data);

        nodemailerMail.sendMail(
          {
            from: 'no-reply@gajiandulu.id',
            to: data.email, // An array if you have multiple recipients.
            subject: `Member Invitation GajianDulu - ${companyData.name}`,
            //You can use "html:" to send HTML email content. It's magic!
            html: `
              <h1>${companyData.name} Member Invitation</h1>
              <p>You have invitation from ${companyData.name}</p>
              <p>The company manager has invited you with these information</p><br>
              <p>Full Name: ${data.name}</p>
              <p>Email: ${data.email}</p>
              <p>Phone: ${data.phone}</p><br>
              <p>Please do register again in GajianDulu Mobile Apps with those information.</p>
              <p>Then you must insert this company codename after you done registration</p>
              <p>--------------------------------------------------------------------------</p>
              <h2>${companyData.codename}</h2>
              <p>--------------------------------------------------------------------------</p>
              `
          },
          function(err, info) {
            if (err) {
              return res
                .status(400)
                .json(
                  response(
                    false,
                    'Failed to send email, please invite member again',
                    err
                  )
                );
            } else {
              return res
                .status(201)
                .json(
                  response(
                    true,
                    'User & Employee has been added successfully',
                    results
                  )
                );
            }
          }
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
