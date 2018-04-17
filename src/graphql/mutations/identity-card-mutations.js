require('module-alias/register');
const { GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');

const { response } = require('@helpers');
const { identity_cards: IdentityCardModel } = require('@models');
const IdentityCardType = require('../types/identity_cards');

const updateIdentityCard = {
  type: IdentityCardType,
  description: 'Update Identity Card',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    identity_number: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString }
  },
  async resolve(root, args) {
    return await IdentityCardModel.findById(args.id).then((result, error) => {
      if (result) {
        const data = Object.assign({}, args);
        return result.update(data);
      } else {
        return root
          .status(400)
          .json(response(false, 'Identity card no found', error));
      }
    });
  }
};

module.exports = { updateIdentityCard };
