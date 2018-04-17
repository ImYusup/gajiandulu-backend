require('module-alias/register');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const UserType = require('../types/users');
const { users: UserModel } = require('@models');

module.exports = new GraphQLObjectType({
  name: 'loans',
  description: 'loans data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(loans) {
          return loans.id;
        }
      },
      user: {
        type: UserType,
        async resolve(loans) {
          return await UserModel.findAll({ where: {id: loans.user_id} });
        }
      },
      amount: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.amount;
        }
      },
      period: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.period;
        }
      },
      service_charge: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.service_charge;
        }
      },
      interest_rate: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.interest_rate;
        }
      },
      interest_charge: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.interest_charge;
        }
      },
      due_date_charge: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.due_date_charge;
        }
      },
      total: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.total;
        }
      },
      purpose: {
        type: GraphQLString,
        resolve(loans) {
          return loans.purpose;
        }
      },
      materai_charge: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.materai_charge;
        }
      },
      due_date: {
        type: GraphQLString,
        resolve(loans) {
          return loans.due_date;
        }
      },
      promo_code: {
        type: GraphQLString,
        resolve(loans) {
          return loans.promo_code;
        }
      },
      promo_discount: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.promo_discount;
        }
      },
      paid: {
        type: GraphQLString,
        resolve(loans) {
          return loans.paid;
        }
      },
      status: {
        type: GraphQLString,
        resolve(loans) {
          return loans.status;
        }
      },
      created_at: {
        type: GraphQLString,
        resolve(loans) {
          return loans.created_at;
        }
      },
      updated_at: {
        type: GraphQLString,
        resolve(loans) {
          return loans.updated_at;
        }
      }
    };
  }
});
