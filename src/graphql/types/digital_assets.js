const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'digital_assets',
  description: 'Digital assets data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(digital_assets) {
          return digital_assets.id;
        }
      },
      path: {
        type: GraphQLString,
        resolve(digital_assets) {
          return digital_assets.path;
        }
      },
      filename: {
        type: GraphQLString,
        resolve(digital_assets) {
          return digital_assets.filename;
        }
      },
      url: {
        type: GraphQLString,
        resolve(digital_assets) {
          return digital_assets.url;
        }
      },
      mime_type: {
        type: GraphQLString,
        resolve(digital_assets) {
          return digital_assets.mime_type;
        }
      },
      is_verified: {
        type: GraphQLInt,
        resolve(digital_assets) {
          return digital_assets.is_verified;
        }
      },
      type: {
        type: GraphQLString,
        resolve(digital_assets) {
          return digital_assets.type;
        }
      }
    };
  }
});
