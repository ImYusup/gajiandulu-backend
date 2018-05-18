require('module-alias/register');
const { response } = require('@helpers');
const { accessTokenService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('*.email_phone')
      .exists()
      .withMessage('Email or Phone cannot be empty'),
    oneOf([
      check('*.email_phone')
        .isMobilePhone('id-ID')
        .withMessage('Must be phone number format'),
      check('*.email_phone')
        .isEmail()
        .withMessage('Must be valid email')
    ]),
    check('*.password', 'passwords must be at least 5 chars long').isLength({
      min: 5
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    accessTokenService.create(req, res);
  }
);

module.exports = router;
