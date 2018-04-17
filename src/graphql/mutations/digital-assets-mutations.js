require('module-alias/register');
const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { response } = require('@helpers');
const { digital_assets: AssetsModel } = require('@models');
const AssetsType = require('../types/digital-assets');

const deleteAssets = {
  type: AssetsType,
  description: 'delete digital assets',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(root, args) {
    const destroy = await AssetsModel.destroy({ where: { id: args.id } });
    if (destroy) {
      root.status(200).json(response(true, 'digital assets deleted successfully'));
    } else {
      root.status(400).json(response(false, 'digital assets not found'));
    }
  }
};

module.exports = { deleteAssets };
