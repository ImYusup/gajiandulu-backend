require('module-alias/register');
const { response } = require('@helpers');
const {
  meService,
  feedbackService,
  feedbackConversationService
} = require('@services/v1');
const express = require('express');
const multer = require('multer');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

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

router.get('/feedbacks', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  feedbackService.get(req, res);
});

router.post(
  '/feedbacks',
  [
    check('*.summary', 'feedback summary required')
      .exists()
      .trim(),
    check('*.message', 'feedback message required')
      .exists()
      .trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    feedbackService.create(req, res);
  }
);

/*
 * Feedback Conversation
 */
router.post(
  '/conversation',
  [
    check('*.feedback_id', 'feedback_id should be string').exists(),
    check('*.message', 'your message can not be empty').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    feedbackConversationService.create(req, res);
  }
);

router.patch(
  '/',
  [
    check(
      '*.old_password',
      'old password required to change new password'
    ).custom((value, { req }) => {
      if (req.body.data.new_password) {
        return value ? true : false;
      }
      return true;
    }),
    check('*.new_password', 'new password required').custom(
      (value, { req }) => {
        if (req.body.data.old_password) {
          return value ? true : false;
        }
        return true;
      }
    )
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    meService.patch(req, res);
  }
);

router.get('/notifications', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  meService.get(req, res);
});

router.post('/checklog', (req, res) => {
  // Before pass the request to service, we need to handle error
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
            'Please specify the type first, type can be checkin or checkout'
          )
        );
    }

    if (!req.body.location) {
      return res
        .status(422)
        .json(
          response(
            false,
            'Please specify the location first, in lat and long coordinates'
          )
        );
    }

    meService.checklog(req, res);
  });
});

module.exports = router;
