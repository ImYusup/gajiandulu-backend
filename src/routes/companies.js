require('module-alias/register');
const { response } = require('@helpers');
const { companyService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('*.name', 'name should only has chars and space').isLength({
      min: 3
    }),
    check('*.address', 'address should be present').exists(),
    check('*.phone', 'must be phone number')
      .optional({ nullable: true })
      .isMobilePhone('id-ID'),
    check('*.timezone', 'timezone should be present').exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    companyService.create(req, res);
  }
);

module.exports = router;
