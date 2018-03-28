require('module-alias/register');
const { response } = require('@helpers');
const { loanService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  loanService.find(req, res);
});

router.get('/:id', (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json(response(false, errors.array()));
  }
  loanService.get(req, res);
});

router.post('/:id', (req, res) => {
  loanService.get(req, res);
});

router.post(
  '/',
  [
    check('*.amount','amount should be present in request body').exists(),
    check('*.period','period should be present in request body').exists(),
    check('*.service_charge','service_charge should be present in request body').exists(),
    check('*.interest_rate','interest_rate should be present in request body').exists(),
    check('*.interest_charge','interest_charge should be present in request body').exists(),
    check('*.due_date_charge','due_date_charge should be present in request body').exists(),
    check('*.purpose','purpose should be present in request body').exists(),
    check('*.materai_charge','materai_charge should be present in request body').exists(),
    check('*.due_date','due_date should be present in request body').exists(),
    check('*.paid','paid should be present in request body').exists(),
    check('*.status','status should be present in request body').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json(response(false, errors.array()));
    }
    loanService.create(req, res);
  }
);

router.patch(
  '/:id',
  [
    check('*.amount','amount should be present in request body').exists(),
    check('*.period','period should be present in request body').exists(),
    check('*.service_charge','service_charge should be present in request body').exists(),
    check('*.interest_rate','interest_rate should be present in request body').exists(),
    check('*.interest_charge','interest_charge should be present in request body').exists(),
    check('*.due_date_charge','due_date_charge should be present in request body').exists(),
    check('*.purpose','purpose should be present in request body').exists(),
    check('*.materai_charge','materai_charge should be present in request body').exists(),
    check('*.due_date','due_date should be present in request body').exists(),
    check('*.paid','paid should be present in request body').exists(),
    check('*.status','status should be present in request body').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    loanService.patch(req, res);
  }
);

router.delete('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  loanService.remove(req, res);
});

module.exports = router;
