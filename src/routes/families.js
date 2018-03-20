require('module-alias/register');
const { response } = require('@helpers');
const { familyService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  familyService.find(req, res);
});

router.get('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  familyService.get(req, res);
});

router.post(
  '/',
  [
    check('*.name', 'name should only has chars and space')
      .isLength({ min: 3 })
      .matches(
        /^[A-Za-z][A-Za-z0-9-]*\s?[A-Za-z][A-Za-z0-9-]*\s?[A-Za-z][A-Za-z0-9-]+$/gi
      ),
    check(
      '*.relative_type',
      'relative_type should only has chars and space'
    ).matches(
      /^[A-Za-z][A-Za-z0-9-]*\s?[A-Za-z][A-Za-z0-9-]*\s?[A-Za-z][A-Za-z0-9-]+$/gi
    ),
    check('*.address', 'address should be present').exists(),
    check('*.phone', 'phone number must be at least 5 chars long')
      .isLength({ min: 5 })
      .matches(/\^[+]|\d|\[-]|\s*/gi)
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    familyService.create(req, res);
  }
);

router.patch('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  familyService.patch(req, res);
});

router.delete('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  familyService.remove(req, res);
});

module.exports = router;
