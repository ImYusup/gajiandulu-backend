require('module-alias/register');
const { response } = require('@helpers');
const { accessTokenService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('*.refresh_token')
      .exists()
      .withMessage('refresh token must be exist')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    accessTokenService.update(req, res);
  }
);

module.exports = router;
