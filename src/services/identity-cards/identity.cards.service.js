require('module-alias/register');
const { response } = require('@helpers');
const { identity_cards: IdentityCard } = require('@models');

const identityCardService = {
  find: async (req, res) => {
    try {
      const identityCard = await IdentityCard.all();
      return res
        .status(200)
        .json(response(true, 'Identity Card retrieved successfully', identityCard, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    const identityCardId = req.params.id;
    try {
      const identityCard = await IdentityCard.findOne({ where: { id: identityCardId } });
      if (identityCard === null) {
        return res
          .status(400)
          .json(response(false, `Identity Card with id ${identityCardId} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'Identity card retrieved successfully', identityCard, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

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

  patch: async (req, res) => {
    const identityCardId = req.params.id;
    const { data } = req.body;
    //TODO: Wait for patch spec mechanism
    try {
      let identityCard = await IdentityCard.findOne({ where: { id: identityCardId } });
      if (identityCard === null) {
        res
          .status(400)
          .json(response(false, `Identity Card with id ${identityCardId} not found`));
      }
      return response(false, 'Not yet', data);
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  remove: async (req, res) => {
    //
  }
};

module.exports = identityCardService;
