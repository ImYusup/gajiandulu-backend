require('module-alias/register');
const { response } = require('@helpers');
const { userService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, body, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('full_name', 'name should only has chars and space').isLength({
      min: 4
    }),
    check('email')
      .isEmail()
      .withMessage('must be a valid email'),
    check('birthday').isISO8601(),
    check('password', 'passwords must be at least 5 chars long').isLength({
      min: 5
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    userService.create(req, res);
  }
);

router.put(
  '/otp',
  [
    body(
      '*.authorization_code',
      'authorization_code should be present'
    ).exists(),
    body('*.hash', 'hash should be present').exists(),
    body('*.user_id', 'user_id should be present').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    userService.put(req, res);
  }
);

module.exports = router;
