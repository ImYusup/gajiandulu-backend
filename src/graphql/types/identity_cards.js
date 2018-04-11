const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'identity_cards',
  description: 'Identity card data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(identity_cards) {
          return identity_cards.id;
        }
      },
      identity_number: {
        type: GraphQLString,
        resolve(identity_cards) {
          return identity_cards.identity_number;
        }
      },
      address: {
        type: GraphQLString,
        resolve(identity_cards) {
          return identity_cards.address;
        }
      },
      city: {
        type: GraphQLString,
        resolve(identity_cards) {
          return identity_cards.city;
        }
      }
    };
  }
});
