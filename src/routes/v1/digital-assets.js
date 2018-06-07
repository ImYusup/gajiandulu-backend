require('module-alias/register');
const { response } = require('@helpers');
const { digitalAssetService } = require('@services/v1');
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
  limits: { fileSize: 8000000, files: 3 }
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

    if (!req.body.type || req.body.type.toString() !== 'avatar') {
      return res
        .status(422)
        .json(
          response(false, 'Please specify the type first, type must be avatar')
        );
    }

    if (!req.body.uploadable_type) {
      return res
        .status(422)
        .json(
          response(
            false,
            'Please specify the uploadable_type first, type can be employees or companies or users, following the table name referenced'
          )
        );
    }

    if (!req.body.uploadable_id) {
      return res
        .status(422)
        .json(
          response(
            false,
            'Please specify the uploadable_id first, the id number based on id number in the table name you set for uploadable_type'
          )
        );
    }

    digitalAssetService.create(req, res);
  });
});

module.exports = router;
