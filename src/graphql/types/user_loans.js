const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'user_loans',
  description: 'user_loans data',
  fields() {
    return {
      full_name: {
        type: GraphQLString,
        resolve(users) {
          return users.full_name;
        }
      },
      email: {
        type: GraphQLString,
        resolve(users) {
          return users.email;
        }
      },
      date_of_birth: {
        type: GraphQLString,
        resolve(users) {
          return users.date_of_birth;
        }
      },
      phone: {
        type: GraphQLString,
        resolve(users) {
          return users.phone;
        }
      },
      is_confirmed_email: {
        type: GraphQLInt,
        resolve(users) {
          return users.is_confirmed_email;
        }
      },
      currency: {
        type: GraphQLString,
        resolve(users) {
          return users.currency;
        }
      }
    };
  }
});
