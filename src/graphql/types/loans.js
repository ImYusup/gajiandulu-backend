import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql');

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
        type: GraphQLInt,
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
        type: GraphQLInt,
        resolve(loans) {
          return loans.due_date;
        }
      },
      promo_code: {
        type: GraphQLInt,
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
      user_id: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.user_id;
        }
      }
    };
  }
});
