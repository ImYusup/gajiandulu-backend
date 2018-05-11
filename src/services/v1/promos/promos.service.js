require('module-alias/register');
const { response } = require('@helpers');
const { promos: Promo } = require('@models');



const promoService = {
  find: async (req, res) => {
    try{
      const promo = await Promo.findAll();
      return res
        .status(200)
        .json(response(true, 'Promo retrieved successfully', promo, null ));
    }  catch(error){
      if (error.errors){
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    const promoId = req.params.id;
    try{
      const promo = await Promo.findOne({where: {id: promoId} });
      if (promo === null) {
        return res
          .status(400)
          .json(response(false, `Promo wiith id ${promoId} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'Promo retrieved successfully', promo, null));
    } catch (error) {
      if (error.errors){
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {

    const {data} = req.body;
    try {
      const promo = await Promo.create(data);
      return res
        .status(201)
        .json(
          response(true, 'Promo created successfully', promo, null)
        );
    } catch (error) {
      if (error.errors){
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  remove: async(req, res) => {
    const promoId = req.params.id;
    try{
      const promo = await Promo.destroy({ where: {id: promoId} });
      if (promo === 0 ) {
        return res
          .status(400)
          .json(response(false, `Promo with id ${promoId} not found`));
      }
      return res.status(204);
    } catch(error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = promoService;
