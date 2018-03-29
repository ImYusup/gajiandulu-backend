require('module-alias/register');
const { response } = require('@helpers');
const { forgotPasswordService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('*.email')
      .isEmail()
      .withMessage('must be a valid email'),
    check('*.hash').exists(),
    check('*.password', 'passwords must be at least 5 chars long').isLength({
      min: 5
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    // console.log(message : req);
    forgotPasswordService.create(req, res);
  }
);

module.exports = router;
