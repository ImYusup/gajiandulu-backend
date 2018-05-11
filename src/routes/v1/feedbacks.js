require('module-alias/register');
const { response } = require('@helpers');
const { feedbackConversationService, feedbackService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
/*
 * Feedback
 */
router.get(
  '/',
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    feedbackService.get(req, res);
  }
);

router.post(
  '/',
  [
    check('*.summary', 'feedback summary required')
      .exists()
      .trim(),
    check('*.message', 'feedback message required')
      .exists()
      .trim(),
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

module.exports = router;
