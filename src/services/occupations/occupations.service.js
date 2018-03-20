// Import model here
const createOccupationModel = require('../../models/occupations.model');

const jwtHelpers = require('../helpers');
const hooks = require('./occupations.hooks');
const response = require('../response');

const occupationService = (Occupation, secret) => ({
  create: async ({data}, params) => {
    const verifiedData = jwtHelpers.verifyJWT(params.headers.authorization, secret);
    const occupationData = Object.assign({}, data, { user_id: verifiedData.id });

    await Occupation.create(occupationData);

    return response(true, 'Occupation succesfully saved');
  },

  update: async (id, data, params) => {
    return response(false, 'not yet available');
  }
});

module.exports = function(app) {
  app.use('/occupations', function(req, res, next) {
    req.feathers.headers = req.headers;
    next();
  }, occupationService(
    createOccupationModel(app),
    app.get('authentication').secret
  ));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('occupations');
  
  service.hooks(hooks);
};
