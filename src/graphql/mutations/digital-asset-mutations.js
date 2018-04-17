require('module-alias/register');
const { GraphQLNonNull, GraphQLString } = require('graphql');

const { response } = require('@helpers');
const { digital_assets: DigitalAssetModel } = require('@models');
const DigitalAssetType = require('../types/digital_assets');

const createDigitalAsset = {
  type: DigitalAssetType,
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
    const results = await DigitalAssetModel.create(dataInsert);
    if (results) {
      return results;
    } else {
      return root
        .status(400)
        .json(response(false, 'Failed to insert database'));
    }
  }
};

module.exports = { createDigitalAsset };
