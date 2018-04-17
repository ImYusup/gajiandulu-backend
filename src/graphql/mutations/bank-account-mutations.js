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
  async resolve(root, args) {
    return await BankAccountModel.findById(args.id).then((result, error) => {
      if (result) {
        const data = Object.assign({}, args);
        return root
          .status(200)
          .json(response(true, 'Bank account update successfully', data));
      } else {
        return root.status(400).json(response(false, 'Bank not found', error));
      }
    });
  }
};

module.exports = { updateBankAccount };
