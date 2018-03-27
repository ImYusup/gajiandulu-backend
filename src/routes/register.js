require('module-alias/register');
const { response } = require('@helpers');
const { userService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('full_name', 'name should only has chars and space').isLength({
      min: 3
    }),
    check('email')
      .isEmail()
      .withMessage('must be a valid email'),
    check('date_of_birth').isISO8601(),
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
    check(
      '*.authorization_code',
      'authorization_code should be present'
    ).exists(),
    check('*.hash', 'hash should be present').exists(),
    check('*.user_id', 'user_id should be present').exists()
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
