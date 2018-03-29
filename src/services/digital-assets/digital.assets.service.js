require('module-alias/register');
const { response } = require('@helpers');
const { digital_assets: DigitalAsset } = require('@models');
const config = require('config');

const digitalAssetService = {
  find: async (req, res) => {
    const { id: user_id } = res.local.users;
    try {
      const digitalAsset = await DigitalAsset.findAll({
        where: { user_id: user_id }
      });
      return res
        .status(200)
        .json(
          response(
            true,
            'Digital assets retrieved successfully',
            digitalAsset,
            null
          )
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    const { id: digitalAssetId } = req.params;
    try {
      const digitalAsset = await DigitalAsset.findOne({
        where: { id: digitalAssetId }
      });
      if (digitalAsset === null) {
        return res
          .status(200)
          .json(
            response(false, `DigitalAsset with id ${digitalAssetId} not found`)
          );
      }
      return res
        .status(200)
        .json(
          response(true, 'Digital assets successfully', digitalAsset, null)
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    // res.local.users from auth middleware
    // check src/helpers/auth.js
    const { id: user_id } = res.local.users;
    const host =
      process.env.NODE_ENV || 'development'
        ? `http://${config.host}:${config.port}/`
        : config.host;

    try {
      const path = req.file.path.split('/')[1];
      const payload = {
        user_id,
        type: req.body.type,
        path: req.file.path,
        filename: req.file.filename,
        mime_type: req.file.mimetype,
        url: `${host}${path}/${req.file.filename}`
      };
      const digitalAsset = await DigitalAsset.create(payload);
      if (digitalAsset) {
        return res
          .status(201)
          .json(
            response(
              true,
              'Digital assets created successfully',
              digitalAsset,
              null
            )
          );
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  remove: async (req, res) => {
    const { id: digitalAssetId } = req.body;
    try {
      const digitalAsset = await DigitalAsset.destroy({
        where: { id: digitalAssetId }
      });
      if (digitalAsset === 0) {
        return res
          .status(400)
          .json(
            response(
              false,
              `Digital assets with id ${digitalAssetId} not found`
            )
          );
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

module.exports = digitalAssetService;
