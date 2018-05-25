require('module-alias/register');
const { response } = require('@helpers');
const { userService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, body, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('full_name', 'full name should be present')
      .matches(/^[A-Za-z\s]+$/i)
      .withMessage('full name can only contain char and space')
      .exists()
      .isLength({
        min: 4
      })
      .withMessage('full name must be at least 4 chars long'),
    check('email', 'email should be present')
      .exists()
      .isEmail()
      .withMessage('must be a valid email'),
    check('phone')
      .exists()
      .withMessage('phone number should pe present')
      .isMobilePhone('id-ID')
      .withMessage('Must be correct phone format'),
    check('birthday')
      .isISO8601()
      .withMessage('birthday format should be YYYY-MM-DD'),
    check('password', 'passwords must be at least 6 chars long').isLength({
      min: 6
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
    body('*.phone', 'phone should be present').exists()
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
