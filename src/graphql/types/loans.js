const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'loans',
  description: 'Loans data',
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
      materai_charge: {
        type: GraphQLString,
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
        type: GraphQLInt,
        resolve(loans) {
          return loans.paid;
        }
      },
      status: {
        type: GraphQLInt,
        resolve(loans) {
          return loans.status;
        }
      },
      purpose: {
        type: GraphQLString,
        resolve(loans) {
          return loans.purpose;
        }
      }
    };
  }
});
