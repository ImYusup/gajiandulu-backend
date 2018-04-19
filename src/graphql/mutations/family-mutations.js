require('module-alias/register');
const { GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');

const { response } = require('@helpers');
const { families: FamilyModel } = require('@models');
const FamilyType = require('../types/families');

const updateFamily = {
  type: FamilyType,
  description: 'Update Family',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    name: { type: GraphQLString },
    relative_type: { type: GraphQLString },
    address: { type: GraphQLString },
    phone: { type: GraphQLString }
  },
  async resolve({req, res}, args) {
    return await FamilyModel.findById(args.id).then((result, error) => {
      if (result) {
        const data = Object.assign({}, args);
        return result.update(data);
      } else {
        return res
          .status(400)
          .json(response(false, 'Family not found', error));
      }
    });
  }
};

module.exports = { updateFamily };
