require('module-alias/register');
const { response } = require('@helpers');
const { occupations: Occupation } = require('@models');

const occupationService = {
  find: async (req, res) => {
    try {
      const occupation = await Occupation.all();
      return res
        .status(200)
        .json(response(true, 'Occupation retrieved successfully', occupation, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    const occupationId = req.params.id;
    try {
      const occupation = await Occupation.findOne({ where: { id: occupationId } });
      if (occupation === null) {
        return res
          .status(400)
          .json(response(false, `Occupation with id ${occupationId} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'Occupation retrieved successfully', occupation, null));
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

  patch: async (req, res) => {
    const occupationId = req.params.id;
    const { data } = req.body;
    // TODO: Wait for patch spec mechanism
    try {
      let occupation = await Occupation.findOne({ where: { id: occupationId } });
      if (occupation === null) {
        res
          .status(400)
          .json(response(false, `Occupation with id ${occupationId} not found`));
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

module.exports = occupationService;
