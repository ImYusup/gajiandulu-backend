require('module-alias/register');
const { response } = require('@helpers');
const { bankDataService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('*.full_name')
      .isLength({ min: 3 }).withMessage('name at least 3 letters')
      .matches(
        /^[A-Za-z]*\s?[A-Za-z]*\s?[A-Za-z]*\s?[A-Za-z]*\s?[A-Za-z][A-Za-z]+$/gi
      ).withMessage('name should only has chars and space'),
    check('*.bank_name', 'bank name should be present').exists(),
    check('*.bank_branch', 'bank branch should be present').exists(),
    check('*.account_number', 'account number must be at least 3 chars long')
      .isLength({ min: 3 })
      .matches(/\^[+]|\d|\[-]|\s*/gi)
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
