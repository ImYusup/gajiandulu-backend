require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');

const { loans: LoanModel } = require('@models');
const LoanType = require('../types/loans');

const loan = {
  type: new GraphQLList(LoanType),
  description: 'get loan by specific ID',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve({req, res}, args) {
    const results = LoanModel.findAll({ where: { id: args.id } });
    return results;
  }
};

const loans = {
  type: new GraphQLList(LoanType),
  description: 'get all loans',
  async resolve({req, res}, args) {
    const results = LoanModel.findAll();
    return results;
  }
};

module.exports = { loan, loans };
