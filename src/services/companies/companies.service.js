require('module-alias/register');
const { response } = require('@helpers');
const { companies: Company } = require('@models');

const companyService = {
  create: async (req, res) => {
    const { data } = req.body;
    // res.local.users from auth middleware
    // check src/helpers/auth.js
    try {
      const payload = Object.assign({}, data, {active: true} );
      let company = await Company.create(payload);
      if (company) {
        return res
          .status(200)
          .json(response(true, 'Company has been successfully created', company, null));
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
