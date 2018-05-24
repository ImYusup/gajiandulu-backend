require('module-alias/register');
const { response } = require('@helpers');
const { memberService } = require('@services/v1');
const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator/check');

router.get('/:id', (req, res) => {
  memberService.get(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
});
router.patch('/:id', [], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  memberService.patch(req, res);
});

module.exports = router;
