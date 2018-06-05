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
      let bank = await BankData.findOne({ where: { active: true, user_id } });
      const bankRedudant = await BankData.findOne({
        where: {
          full_name: data.full_name,
          bank_name: data.bank_name,
          account_number: data.account_number,
          user_id
        }
      });
      const payload = Object.assign({}, data, { user_id }, { active: true });

      if (bankRedudant) {
        bank = await BankData.update(payload, {
          where: {
            full_name: data.full_name,
            bank_name: data.bank_name,
            account_number: data.account_number,
            user_id
          }
        });
      } else {
        if (!bank) {
          bank = await BankData.create(payload);
        }
        if (bank) {
          bank = await BankData.update(
            { active: false },
            { where: { user_id, active: true } }
          );
          bank = await BankData.create(payload);
        }
      }
      return res
        .status(201)
        .json(response(true, 'Bank data created successfully', bank, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = bankDataService;
