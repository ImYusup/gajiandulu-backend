require('module-alias/register');
const { response } = require('@helpers');
const { companies: Company } = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const companyService = {
  create: async (req, res) => {
    const { data } = req.body;
    // res.local.users from auth middleware
    // check src/helpers/auth.js
    // let noSpaces = req.body.name.replace(/\s/g, '');
    // let theCode = noSpaces.replace(/[aeiou]/ig,'').toUpperCase();
    let theCode = 'PTBB';
    // let lastNum = '001';
    // let finalCode = (theCode+lastNum);
    const companyExist = await Company.findOne({
      where: { codename: { [Op.like]: `${theCode}%` } }
    });
    /* eslint-disable no-console*/
    console.log('datanya', parseInt(companyExist.codename.substr(-3)) + 1);

    // if (companyExist) {
    //   let lastNums = companyExist.substr(-3);
    //   lastNums = parseInt(lastNums);
    //   lastNums++;
    //   lastNums = ('0000' + lastNums).substr(-3);
    //   let finalCode = theCode + lastNums;
    // } else {
    //   lastNum = parseInt(lastNum);
    //   // lastNum++;
    //   lastNum = ('0000' + lastNum).substr(-3);
    //   let finalCode = theCode + lastNum;
    // }

    try {
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
