const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'bank_data',
  description: 'bank data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(bank_data) {
          return bank_data.id;
        }
      },
      full_name: {
        type: GraphQLString,
        resolve(bank_data) {
          return bank_data.full_name;
        }
      },
      bank_name: {
        type: GraphQLString,
        resolve(bank_data) {
          return bank_data.bank_name;
        }
      },
      bank_branch: {
        type: GraphQLString,
        resolve(bank_data) {
          return bank_data.bank_branch;
        }
      },
      account_number: {
        type: GraphQLString,
        resolve(bank_data) {
          return bank_data.account_number;
        }
      },
      active: {
        type: GraphQLInt,
        resolve(bank_data) {
          return bank_data.active;
        }
      }
    };
  }
});
