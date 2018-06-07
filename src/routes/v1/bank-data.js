require('module-alias/register');
const { response } = require('@helpers');
const { bankDataService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  bankDataService.get(req, res);
});

router.post(
  '/',
  [
    check('*.full_name')
      .isLength({ min: 3 })
      .withMessage('name at least 3 letters'),
    check('*.bank_name', 'bank name should be present').exists(),
    check('*.bank_branch', 'bank branch should be present').exists(),
    check('*.account_number')
      .matches(/^[\d]+$/i)
      .withMessage('Only number that allowed')
      .isLength({ min: 5 })
      .withMessage('account number must be at least 5 chars long')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    bankDataService.create(req, res);
  }
);

module.exports = router;
