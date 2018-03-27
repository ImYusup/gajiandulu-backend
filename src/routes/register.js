require('module-alias/register');
const { response } = require('@helpers');
const { userService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.post(
  '/',
  [
    check('full_name', 'name should only has chars and space')
      .isLength({min: 3})
      
      //for regex name must have any space
    .matches(/^[A-zA-Z]+(?:[\s.]+[a-zA-Z]+)(\s\g)*/g),
  
    check('email')
      .isEmail()
      .withMessage('must be a valid email'),
    check('date_of_birth').isISO8601(),
    check('password', 'passwords must be at least 5 chars long').isLength({
      min: 5
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    userService.create(req, res);
  }
);

module.exports = router;
