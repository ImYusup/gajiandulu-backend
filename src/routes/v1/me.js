require('module-alias/register');
const { response } = require('@helpers');
const {
  meService,
  feedbackService,
  feedbackConversationService
} = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

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

module.exports = router;
