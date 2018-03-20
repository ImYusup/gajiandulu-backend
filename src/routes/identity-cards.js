require('module-alias/register');
const { response } = require('@helpers');
const { identityCardService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('*.identity_number', 'name should only has chars and space').isLength(
      { min: 3 }
    ),
    check('*.address', 'address should be present in request body').exists(),
    check('*.city', 'city should be present in request body').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    identityCardService.create(req, res);
  }
);

module.exports = router;
