require('module-alias/register');
const { GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');

const { response } = require('@helpers');
const { bank_data: BankAccountModel } = require('@models');
const BankAccountType = require('../types/bank_datas');

const updateBankAccount = {
  type: BankAccountType,
  description: 'Update Bank Account',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    full_name: { type: GraphQLString },
    bank_name: { type: GraphQLString },
    bank_branch: { type: GraphQLString },
    account_number: { type: GraphQLString }
  },
  async resolve({req, res}, args) {
    return await BankAccountModel.findById(args.id).then((result, error) => {
      if (result) {
        const data = Object.assign({}, args);
        return result.update(data);
      } else {
        return res.status(400).json(response(false, 'Bank not found', error));
      }
    });
  }
};

module.exports = { updateBankAccount };
