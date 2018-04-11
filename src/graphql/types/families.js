const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'families',
  description: 'families data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(families) {
          return families.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve(families) {
          return families.name;
        }
      },
      relative_type: {
        type: GraphQLString,
        resolve(families) {
          return families.relative_type;
        }
      },
      address: {
        type: GraphQLString,
        resolve(families) {
          return families.address;
        }
      },
      phone: {
        type: GraphQLString,
        resolve(families) {
          return families.phone;
        }
      }
    };
  }
});
