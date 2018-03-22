require('module-alias/register');
const { response } = require('@helpers');
const { digitalAssetService } = require('@services');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const config = require('config');

const storage = multer.diskStorage({
  destination: config.uploads,
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 500000, files: 3 }
}).single('file');

router.get('/', upload, (req, res) => {
  upload(req, res, function(error) {
    if (error) {
      return res.status(422).json(response(false, error.message));
    }

    digitalAssetService.find(req, res);
  });
});

router.get('/:id', upload, (req, res) => {
  upload(req, res, function(error) {
    if (error) {
      return res.status(422).json(response(false, error.message));
    }

    digitalAssetService.find(req, res);
  });
});

router.post('/', (req, res) => {
  // Before pass the request to service, we need to handle error
  upload(req, res, function(error) {
    if (error) {
      return res.status(422).json(response(false, error.message));
    }
    if (!req.file) {
      return res
        .status(422)
        .json(
          response(false, 'Are you sure already choosen an image or file?')
        );
    }
    if (!req.body.type) {
      return res
        .status(422)
        .json(
          response(
            false,
            'Please specify the type first, type can be signature, photo, card, etc'
          )
        );
    }
    digitalAssetService.create(req, res);
  });
});

module.exports = router;
