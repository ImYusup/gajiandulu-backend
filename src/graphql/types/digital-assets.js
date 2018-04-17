const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'assets',
  description: 'digital assets data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve (assets) {
          return assets.id;
        }
      },
      user_id: {
        type: GraphQLString,
        resolve (assets) {
          return assets.user_id;
        }
      },
      path: {
        type: GraphQLString,
        resolve (assets) {
          return assets.path;
        }
      },
      filename: {
        type: GraphQLString,
        resolve (assets) {
          return assets.filename;
        }
      },
      url: {
        type: GraphQLString,
        resolve (assets) {
          return assets.url;
        }
      },
      mime_type: {
        type: GraphQLString,
        resolve (assets) {
          return assets.mime_type;
        }
      },
      is_verified: {
        type: GraphQLInt,
        resolve (assets) {
          return assets.is_verified;
        }
      },
      type: {
        type: GraphQLString,
        resolve (assets) {
          return assets.type;
        }
      },
    };
  }
});
