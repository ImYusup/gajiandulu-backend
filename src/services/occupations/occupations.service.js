require('module-alias/register');
const { response } = require('@helpers');
const { occupations: Occupation } = require('@models');

const occupationService = {
  create: async (req, res) => {
    const { data } = req.body;
    const { id: userId } = res.local.users;
    try {
      const payload = Object.assign({}, data, {
        user_id: userId
      });

      const occupation = await Occupation.create(payload);

      return res
        .status(201)
        .json(response(true, 'Occupation succesfully saved', occupation, null));
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

module.exports = occupationService;
