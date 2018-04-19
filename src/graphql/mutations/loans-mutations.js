require('module-alias/register');
const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
  GraphQLString
} = require('graphql');

const{ response } = require('@helpers');
const { loans: LoanModel } = require('@models');
const LoanType = require('../types/loans');

const updateLoan = {
  type: LoanType,
  description: 'update loan data',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    amount: { type: GraphQLString},
    period: { type: GraphQLString},
    service_charge: { type: GraphQLString},
    interest_rate: { type: GraphQLString},
    interest_charge: { type: GraphQLString},
    due_date_charge: { type: GraphQLString},
    total: { type: GraphQLString},
    purpose: { type: GraphQLString},
    materai_charge: { type: GraphQLString},
    due_date: { type: GraphQLString},
    promo_code: { type: GraphQLString},
    promo_discount: { type: GraphQLString},
    paid: { type: GraphQLInt},
    status: { type: GraphQLInt}
  },
  async resolve({req, res}, args) {
    return await LoanModel.findByID(args.id).then((result, error) => {
      if (result) {
        return result.update(args);
      } else {
        return res
          .status(400)
          .json(response(false, 'loan data is not found', error));
      }
    });
  }
};

const deleteLoan = {
  type: LoanType,
  description: 'delete loan',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  async resolve({req, res}, args) {
    const destroy = await LoanModel.destroy({ where: { id: args.id } });
    if (destroy) {
      res.status(200).json(response(true, 'A loan has been successfully deleted'));
    } else {
      res.status(400).json(response(false, 'loan not found'));
    }
  }
};

module.exports = { updateLoan, deleteLoan };
