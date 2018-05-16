require('module-alias/register');
const { response } = require('@helpers');
const { bank_data: BankData } = require('@models');

const bankDataService = {
  create: async (req, res) => {
    const { data } = req.body;
    // res.local.users from auth middleware
    // check src/helpers/auth.js
    const { id: user_id } = res.local.users;
    try {
      const payload = Object.assign({}, data, { user_id }, { active: true });
      const bank = await BankData.create(payload);
      if (bank) {
        return res
          .status(201)
          .json(response(true, 'Bank data created successfully', bank, null));
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = bankDataService;
