//Import model here
const createIdentityCardModel = require('../../models/identity.cards.model');

const jwtHelpers = require('../helpers');
const hooks = require('./identity.cards.hooks');
const response = require('../response');

const identityCardService = (IdentityCard, secret) => ({
  create: async ({data}, params) => {
    const verifiedData = jwtHelpers.verifyJWT(params.headers.authorization, secret);
    const identityCardData = Object.assign({}, data, { user_id: verifiedData.id });

    await IdentityCard.create(identityCardData);

    return response(true, 'Identity info successfully saved');
  },

  update: async (id, data, params) => {
    return response(false, 'not yet available');
  }
});

module.exports = function(app) {
  app.use('/identity-cards', function(req, res, next) {
    req.feathers.headers = req.headers;
    next();
  }, identityCardService(
    createIdentityCardModel(app),
    app.get('authentication').secret
  ));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('identity-cards');

  service.hooks(hooks);
};
