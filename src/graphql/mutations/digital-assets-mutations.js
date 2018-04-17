require('module-alias/register');
const { GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');

const { response } = require('@helpers');
const { digital_assets: AssetsModel } = require('@models');
const AssetsType = require('../types/digital-assets');

const createDigitalAssets = {
  type: AssetsType,
  description: 'Crate digital asset',
  args: {
    type: {
      type: GraphQLNonNull(GraphQLString)
    },
    filename: {
      type: GraphQLNonNull(GraphQLString)
    }
  },
  async reslove(root, args, res) {
    const { type, filename } = args;
    // const { id: user_id } = res.local.users;
    const dataInsert = Object.assign(
      {},
      {
        type,
        filename,
        user_id: 3,
        path: 'http://gajiandulu.com/path/to/file',
        url: 'http://gajiandulu.com/path/to/file',
        mime_type: 'Tes',
        is_verified: 0
      }
    );
    const results = await AssetsModel.create(dataInsert);
    if (results) {
      return results;
    } else {
      return root
        .status(400)
        .json(response(false, 'Failed to insert database'));
    }
  }
};

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
      root
        .status(200)
        .json(response(true, 'digital assets deleted successfully'));
    } else {
      root.status(400).json(response(false, 'digital assets not found'));
    }
  }
};

module.exports = { createDigitalAssets, deleteAssets };
