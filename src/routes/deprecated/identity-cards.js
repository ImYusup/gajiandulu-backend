require('module-alias/register');
const { response } = require('@helpers');
const { identityCardService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  identityCardService.find(req, res);
});

router.get('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  identityCardService.get(req, res);
});

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

router.patch(
  '/:id',
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
    identityCardService.patch(req, res);
  }
);

router.delete('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  identityCardService.remove(req, res);
});

module.exports = router;
