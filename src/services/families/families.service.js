require('module-alias/register');
const { response } = require('@helpers');
const { families: Family } = require('@models');

const familyService = {
  find: async (req, res) => {
    try {
      const family = await Family.all();
      return res
        .status(200)
        .json(response(true, 'Family retrieved successfully', family, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    const { id: familyId } = req.params;
    try {
      const family = await Family.findOne({ where: { id: familyId } });
      if (family === null) {
        return res
          .status(200)
          .json(response(false, `Family with id ${familyId} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'Family retrieved successfully', family, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  patch: async (req, res) => {
    const { id: familyId } = req.params;
    const { data } = req.body;
    try {
      let family = await Family.findOne({ where: { id: familyId } });
      if (family === null) {
        return res
          .status(400)
          .json(response(false, `Family with id ${familyId} not found`));
      }

      const updatedFamily = await Family.update(data, {
        where: { id: familyId }
      });
      if (updatedFamily[0] === 0) {
        return res
          .status(400)
          .json(response(false, `Updating family with ${familyId} was failed`));
      }

      family = await Family.findOne({ where: { id: familyId } });

      return res
        .status(200)
        .json(response(true, 'Family updated successfully', family, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    const { data } = req.body;
    // res.local.users from auth middleware
    // check src/helpers/auth.js
    const { id: user_id } = res.local.users;
    try {
      const payload = Object.assign({}, data, { user_id });
      let family = await Family.create(payload);
      if (family) {
        return res
          .status(200)
          .json(response(true, 'Family created successfully', family, null));
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  remove: async (req, res) => {
    const { id: familyId } = req.body;
    try {
      const family = await Family.destroy({ where: { id: familyId } });
      if (family === 0) {
        return res
          .status(400)
          .json(response(false, `family with id ${familyId} not found`));
      }
      return null;
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = familyService;
