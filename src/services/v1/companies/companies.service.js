require('module-alias/register');
const { response } = require('@helpers');
const { companies: Company, digital_assets: DigitalAsset, employees: Employee, users: User, presences: Presence } = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const companyService = {

  get: async (req, res) => {
    const presence_id = req.params.presence_id;
    try {
      const presences = await Presence.findOne({
        where: { id: presence_id },
        include: [{
          model: Employee,
          include: [{
            model: User
          }]
        }]
      });
      const assets = await DigitalAsset.findOne({
        where: {
          uploadable_id: presences.employee.id,
          uploadable_type: 'employees'
        }
      });
      let result = Object.assign(
        {
          'id': presences.id,
          'presence_date': presences.presence_date,
          'presence_start': presences.presence_id,
          'presence_end': presences.presence_end,
          'rest_start': presences.rest_start,
          'rest_end': presences.rest_end,
          'presence_overdue': presences.presence_overdue,
          'is_absence': presences.is_absence,
          'is_leave': presences.is_leave,
          'overwork': presences.overwork,
          'work_hours': presences.work_hours,
          'salary': presences.salary,
          'fine': presences.fine,
          'employee': {
            'id': presences.employee.id,
            'role': presences.employee.role,
            'full_name': presences.employee.user.full_name,
            'email': presences.employee.user.email,
            'phone': presences.employee.user.phone,
            'assets': [
              {
                'type': assets.type,
                'path': assets.path
              }
            ]
          }
        }
      );
      if (!presences) {
        return res
          .status(400)
          .json(response(false, `Presences with id ${presence_id} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'Schedule detail retrieved successfully', result));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    const { data } = req.body;
    let noSpaces = req.body.data.name.replace(/\s/g, '');
    // res.local.users from auth middleware
    // check src/helpers/auth.js

    try {
      let finalCode;
      let removePunctuations = noSpaces.replace(
        /[.,/#!$%^&*;:{}=\-_`~()]/g,
        ''
      );
      let theCode = removePunctuations.replace(/[aeiou]/gi, '').toUpperCase();
      const companyExist = await Company.findOne({
        order: [['created_at', 'DESC']],
        where: { codename: { [Op.like]: `${theCode}%` } }
      });

      if (companyExist) {
        let lastNums = companyExist.codename.substr(-3);
        lastNums = parseInt(lastNums);
        lastNums++;
        lastNums = ('0000' + lastNums).substr(-3);
        finalCode = theCode + '-' + lastNums;
      } else {
        const lastNum = '001';
        finalCode = theCode + '-' + lastNum;
      }

      const payload = Object.assign({}, data, {
        codename: finalCode,
        active: true
      });
      let company = await Company.create(payload);
      if (company) {
        return res
          .status(200)
          .json(
            response(
              true,
              'Company has been successfully created',
              company,
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

module.exports = companyService;
