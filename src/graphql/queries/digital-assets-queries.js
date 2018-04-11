require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');

const { digital_assets: AssetsModel } = require('@models');
const AssetsType = require('../types/digital-assets');

const digitalAssets = {
  type: new GraphQLList(AssetsType),
  description: 'get all users',
  async resolve(root, args) {
    const results = AssetsModel.findAll();
    return results;
  }
}

module.exports = { digitalAssets };
