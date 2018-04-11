const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'roles',
  description: 'roles data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(roles) {
          return roles.id;
        }
      },
      role: {
        type: GraphQLString,
        resolve(roles) {
          return roles.role;
        }
      }
    };
  }
});
