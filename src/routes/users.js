require('module-alias/register');
const { response } = require('@helpers');
const { userService } = require('@services');
const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  userService.find(req, res);
});

router.get('/:id', (req, res) => {
  userService.get(req, res);
});

router.patch(
  '/:id',
  [
    check('*.phone', 'phone number should be present min 5 number')
      .exists()
      .isLength({ min: 5 }),
    check('*.hash', 'hash should be present')
      .exists()
      .isLength({ min: 10 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    userService.patch(req, res);
  }
);

router.put(
  '/:id',
  [
    body(
      '*.authorization_code',
      'authorization_code should be present'
    ).exists(),
    body('*.hash', 'hash should be present').exists()
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
