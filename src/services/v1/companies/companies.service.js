require('module-alias/register');
const { response } = require('@helpers');
const {
  companies: Company,
  employees: Employee,
  users: User
} = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const companyService = {
  get: async (req, res) => {
    const { id: user_id } = res.local.users;

    try {
      if (req.query.codename) {
        const { codename } = req.query;
        const isCompany = await Company.findOne({
          where: { codename },
          attributes: { exclude: ['created_at', 'updated_at'] }
        });
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
        await Employee.update({ flag: 3 }, { where: { user_id } });

        return res
          .status(200)
          .json(
            response(true, 'Company has been successfully retrieved', isCompany)
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
