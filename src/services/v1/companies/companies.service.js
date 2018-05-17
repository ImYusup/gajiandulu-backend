require('module-alias/register');
const { response } = require('@helpers');
const {
  companies: Company,
  employees: Employee,
  users: User,
  digital_assets: DigitalAsset,
  presences: Presence
} = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const companyService = {
  get: async (req, res) => {
    const { company_id, presence_id } = req.params;
    const { id: user_id } = res.local.users;

    try {
      if (req.query.codename) {
        const { codename } = req.query;
        const isCompany = await Company.findOne({ where: { codename } });
        if (!isCompany) {
          return res
            .status(400)
            .json(response(false, 'Company code not found'));
        }
        const isInvited = await Employee.findOne({
          where: { user_id, company_id: isCompany.id, flag: 1 }
        });
        if (!isInvited) {
          return res
            .status(400)
            .json(response(false, 'You are not invited yet'));
        }
        await User.update(
          { registration_complete: 1 },
          { where: { id: user_id } }
        );
        return res
          .status(200)
          .json(
            response(true, 'Company has been successfully retrieved', isCompany)
          );
      } else {
        const presences = await Presence.findOne({
          where: { id: presence_id },
          include: [
            {
              model: Employee,
              where: { company_id },
              include: [
                {
                  model: User
                }
              ]
            }
          ]
        });
        const assets = await DigitalAsset.findOne({
          where: {
            uploadable_id: presences.employee.id,
            uploadable_type: 'employees'
          }
        });
        let result = Object.assign(
          {},
          presences,
          {
            employee: {
              full_name: presences.employee.user.full_name,
              email: presences.employee.user.email,
              phone: presences.employee.user.phone,
              assets: [
                {
                  type: assets.type,
                  path: assets.path
                }
              ]
            }
          },
          delete presences.employee.user.full_name,
          delete presences.employee.user.email,
          delete presences.employee.user.phone
        );
        if (!presences) {
          return res
            .status(400)
            .json(
              response(false, `Presences with id ${presence_id} not found`)
            );
        }
        return res
          .status(200)
          .json(
            response(true, 'Schedule detail retrieved successfully', result)
          );
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  patch: async (req, res) => {
    const { data } = req.body;
    const { company_id } = req.params;

    try {
      let updateCompany = await Company.findOne({ where: { id: company_id } });
      if (!updateCompany) {
        return res
          .status(400)
          .json(response(false, `Company with id ${company_id} is not found`));
      }

      updateCompany = await Company.update(data, {
        where: { id: company_id }
      });
      if (!updateCompany) {
        return res
          .status(400)
          .json(
            response(false, `Nothing changed in Company with id ${company_id}`)
          );
      }

      updateCompany = await Company.findOne({ where: { id: company_id } });
      return res
        .status(200)
        .json(
          response(true, 'Company has been successfully updated', updateCompany)
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    const { data } = req.body;
    // res.local.users from auth middleware
    // check src/helpers/auth.js
    const { id: user_id } = res.local.users;

    try {
      let finalCode;
      const codeName = data.name
        .replace(/[aeiou.,/#!$%^&*;:{}=\-_`~()\s]/g, '')
        .substring(0, 6)
        .toUpperCase();
      const companyExist = await Company.findOne({
        order: [['created_at', 'DESC']],
        where: { codename: { [Op.like]: `${codeName}%` } }
      });

      if (companyExist) {
        let lastNums = companyExist.codename.substr(-3);
        lastNums = parseInt(lastNums);
        lastNums++;
        lastNums = ('0000' + lastNums).substr(-3);
        finalCode = codeName + '-' + lastNums;
      } else {
        const lastNum = '001';
        finalCode = codeName + '-' + lastNum;
      }

      const payload = Object.assign({}, data, {
        codename: finalCode,
        active: true
      });
      const company = await Company.create(payload);
      await Employee.create({
        company_id: company.id,
        salary: 0,
        user_id,
        role: 1,
        flag: 3
      });
      await User.update(
        { registration_complete: 1 },
        { where: { id: user_id } }
      );
      if (company) {
        return res
          .status(201)
          .json(
            response(true, 'Company has been successfully created', company)
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
