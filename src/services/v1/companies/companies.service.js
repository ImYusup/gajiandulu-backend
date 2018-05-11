require('module-alias/register');
const { response } = require('@helpers');
const { companies: Company } = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const companyService = {
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
