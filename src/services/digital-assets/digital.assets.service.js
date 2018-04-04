require('module-alias/register');
const { response } = require('@helpers');
const { digital_assets: DigitalAsset, users: User } = require('@models');
const config = require('config');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const path = require('path');
const fs = require('fs');

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

  // @TODO refactor later for better readybility
  create: async (req, res) => {
    // res.local.users from auth middleware
    // check src/helpers/auth.js
    const { id: user_id } = res.local.users;
    const host =
      process.env.NODE_ENV || 'development'
        ? `http://${config.host}:${config.port}/`
        : config.host;

    let location;

    let payload = {
      user_id,
      type: req.body.type
    };

    // This will handle file as encoded base64 from client
    if (!req.file) {
      const base64Data = req.body.file.replace(/^data:image\/png;base64,/, '');
      const filename = Date.now() + '.png';

      location = path.join(__dirname + '/../../../public/uploads/' + filename);

      fs.writeFile(location, base64Data, 'base64', error => {
        if (error) {
          return new Error('Something went wrong when save your image!');
        }
      });
      payload['filename'] = filename;
      payload['mime_type'] = 'image/png';
      payload['path'] = 'public/uploads/' + filename;
      payload['url'] = host + 'uploads/' + filename;
    }

    // This will handle file as blob from client
    if (req.file) {
      location = req.file.path.split('/')[1];

      payload['path'] = req.file.path;
      payload['filename'] = req.file.filename;
      payload['mime_type'] = req.file.mimetype;
      payload['url'] = `${host}${location}/${req.file.filename}`;
    }

    // Find if existing type already exists
    try {
      let digitalAsset = await DigitalAsset.findOne({
        where: {
          [Op.and]: [{ user_id: user_id }, { type: req.body.type }]
        }
      });

      // Create new record if a user does not have the type of digital assets
      if (!digitalAsset) {
        digitalAsset = await DigitalAsset.create(payload);
      }

      // Update the record if type already exists
      if (digitalAsset) {
        digitalAsset = await DigitalAsset.update(payload, {
          where: {
            [Op.and]: [{ user_id: user_id }, { type: req.body.type }]
          }
        });

        // since update not returning the record we need to get the record
        digitalAsset = await DigitalAsset.findOne({
          where: {
            [Op.and]: [{ user_id: user_id }, { type: req.body.type }]
          }
        });
      }

      if (!digitalAsset) {
        return res
          .status(400)
          .json(
            response(
              true,
              `Sorry, digital assets type ${req.body.type} not created!`
            )
          );
      }

      if (req.body.type === 'signature') {
        await User.update(
          { registration_complete: true },
          { where: { id: user_id } }
        );
      }

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
