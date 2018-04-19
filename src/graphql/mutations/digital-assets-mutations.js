require('module-alias/register');
const { GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');
const AssetsType = require('../types/digital-assets');
const config = require('config');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { response } = require('@helpers');
const { digital_assets: AssetsModel } = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const sendFile = async (req, res, args) => {
  const host =
    process.env.NODE_ENV !== 'production'
      ? `http://${config.host}:${config.port}/`
      : `http://${config.host}/`;

  let location;

  const payload = {
    user_id: args.user_id,
    type: args.type
  };

  if (!req.file) {
    const base64Data = req.body.file.replace(/^data:image\/png;base64,/, '');
    const filename = Date.now() + '.png';

    location = path.join(__dirname + '../../../public/uploads' + filename);

    fs.writeFile(location, base64Data, 'base64', error => {
      if (error) {
        return new Error('Something went wrong when saving image');
      }
    });

    payload['filename'] = filename;
    payload['mime_type'] = 'image/png';
    payload['path'] = 'public/uploads' + filename;
    payload['url'] = host + 'uploads/' + filename;
  }

  if (req.file) {
    location = req.file.path.split('/')[1];

    payload['path'] = req.file.path;
    payload['filename'] = req.file.filename;
    payload['mime_type'] = req.file.mime_type;
    payload['url'] = `${host}${location}/${req.file.filename}`;
  }

  try {
    let assetResults = await AssetsModel.findOne({
      where: {
        [Op.and]: [{ user_id: args.user_id }, { type: args.type }]
      }
    });

    // Create new record if a user does not have the type of digital assets
    if (!assetResults) {
      assetResults = await AssetsModel.create(payload);
    }

    // Update the record if type already exists
    if (assetResults) {
      assetResults = await AssetsModel.update(payload, {
        where: {
          [Op.and]: [{ user_id: args.user_id }, { type: args.type }]
        }
      });

      // since update not returning the record we need to get the record
      assetResults = await AssetsModel.findOne({
        where: {
          [Op.and]: [{ user_id: args.user_id }, { type: args.type }]
        }
      });
    }

    if (!assetResults) {
      return res
        .status(400)
        .json(
          response(true, `Sorry, digital assets type ${args.type} not created!`)
        );
    }

    return assetResults;
  } catch (error) {
    if (error.errors) {
      return res.status(400).json(response(false, error.errors));
    }
    return res.status(400).json(response(false, error.message));
  }
};

const createDigitalAssets = {
  type: AssetsType,
  description: 'Crate digital asset',
  args: {
    uri: {
      type: GraphQLNonNull(GraphQLString)
    },
    type: {
      type: GraphQLNonNull(GraphQLString)
    },
    filename: {
      type: GraphQLNonNull(GraphQLString)
    }
  },
  async resolve({ req, res }, args) {
    const storage = multer.diskStorage({
      destination: config.uploads,
      filename: function(req, file, cb) {
        cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
      }
    });
    const upload = multer({
      storage: storage,
      limits: { fileSize: 8000000, files: 3 }
    }).single('file');

    upload(req, res, function(error) {
      if (error) {
        return res.status(422).json(response(false, error.message));
      }

      if (!req.body.type) {
        return res
          .status(422)
          .json(
            response(
              false,
              'Please specify the type first, type can be signature, avatar, card, etc'
            )
          );
      }

      sendFile(req, res, args);
    });
  }
};

const deleteAssets = {
  type: AssetsType,
  description: 'delete digital assets',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  async resolve({ req, res }, args) {
    const destroy = await AssetsModel.destroy({ where: { id: args.id } });
    if (destroy) {
      res
        .status(200)
        .json(response(true, 'digital assets deleted successfully'));
    } else {
      res.status(400).json(response(false, 'digital assets not found'));
    }
  }
};

module.exports = { createDigitalAssets, deleteAssets };
