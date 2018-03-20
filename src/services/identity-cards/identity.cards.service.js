require('module-alias/register');
const { response } = require('@helpers');
const { identity_cards: IdentityCard } = require('@models');

const identityCardService = {
  create: async (req, res) => {
    const { data } = req.body;
    const { id: userId } = res.local.users;
    try {
      const payload = Object.assign({}, data, {
        user_id: userId
      });

      const identityCard = await IdentityCard.create(payload);

      return res
        .status(201)
        .json(
          response(true, 'Identity info successfully saved', identityCard, null)
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  update: async (id, data, params) => {
    // return response(false, 'not yet available');
  }
};

module.exports = identityCardService;
