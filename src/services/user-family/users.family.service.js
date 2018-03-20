const createUserFamilyModel = require('../../models/users.family.model');
const hooks = require('./users.family.hooks.js');
const response = require('../response');

const familyService = Family => ({
  find: async params => {
    try {
      const family = await Family.all();
      return response(true, 'Family retrieved successfully', family, null);
    } catch (error) {
      return response(false, error.message);
    }
  },

  get: async (id, params) => {
    const family = await Family.findOne({ where: { id } });
    if (family === null) {
      throw new Error(false, 'Family not found!');
    }
    return response(true, 'Family retrieved successfully', family, null);
  },

  patch: async (id, data, params) => {
    let user = await Family.findOne({ where: { id: id } });
    if (user === null) {
      return response(false, `Family with id ${id} not found`);
    }

    const updatedFamily = await Family.update(data.data, { where: { id: id } });
    if (updatedFamily[0] === 0) {
      return response(false, 'Family update was failed');
    }

    user = await Family.findOne({ where: { id: id } });

    return response(true, 'Family updated successfully', user, null);
  },

  create: async (data, param) => {
    try {
      let family = await Family.create(data.data);
      if (family) {
        return response(true, 'Family created successfully', family, null);
      }
    } catch (error) {
      return response(false, error.message);
    }
  },

  remove: async (id, params) => {
    const family = await Family.destroy({ where: { id: id } });
    if (family === 0) {
      throw new Error(`family with id ${id} not found`);
    }
    return null;
  }
});

module.exports = function(app) {
  app.use('/family', familyService(createUserFamilyModel(app)));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('family');

  service.hooks(hooks);
};
