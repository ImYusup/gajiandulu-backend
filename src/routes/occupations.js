require('module-alias/register');
const { response } = require('@helpers');
const { occupationService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  occupationService.find(req, res);
});

router.get('/:id', (req, res) => {
  occupationService.get(req, res);
});

router.post(
  '/',
  [
    check('*.name', 'name should only has chars and space').isLength({
      min: 3
    }),
    check(
      '*.annual_salary_range_min',
      'annual_salary_range_min should be present in request body'
    ).exists(),
    check(
      '*.annual_salary_range_max',
      'annual_salary_range_max should be present in request body'
    ).exists(),
    check(
      '*.monthly_salary',
      'monthly_salary should be present in request body'
    ).exists(),
    check(
      '*.loan_purpose',
      'loan_purpose should be present in request body'
    ).exists(),
    check(
      '*.company_name',
      'company_name should be present in request body'
    ).exists(),
    check('*.position', 'position should be present in request body').exists(),
    check(
      '*.company_address',
      'company_address should be present in request body'
    ).exists(),
    check(
      '*.company_phone',
      'company_phone should be present in request body'
    ).exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    occupationService.create(req, res);
  }
);

router.patch(
  '/:id',
  [
    check('*.name', 'name should only has chars and space').isLength({
      min: 3
    }),
    check(
      '*.annual_salary_range_min',
      'annual_salary_range_min should be present in request body'
    ).exists(),
    check(
      '*.annual_salary_range_max',
      'annual_salary_range_max should be present in request body'
    ).exists(),
    check(
      '*.monthly_salary',
      'monthly_salary should be present in request body'
    ).exists(),
    check(
      '*.loan_purpose',
      'loan_purpose should be present in request body'
    ).exists(),
    check(
      '*.company_name',
      'company_name should be present in request body'
    ).exists(),
    check('*.position', 'position should be present in request body').exists(),
    check(
      '*.company_address',
      'company_address should be present in request body'
    ).exists(),
    check(
      '*.company_phone',
      'company_phone should be present in request body'
    ).exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    occupationService.patch(req, res);
  }
);

router.put(
  '/:id',
  [
    check('*.name', 'name should only has chars and space').isLength({
      min: 3
    }),
    check(
      '*.annual_salary_range_min',
      'annual_salary_range_min should be present in request body'
    ).exists(),
    check(
      '*.annual_salary_range_max',
      'annual_salary_range_max should be present in request body'
    ).exists(),
    check(
      '*.monthly_salary',
      'monthly_salary should be present in request body'
    ).exists(),
    check(
      '*.loan_purpose',
      'loan_purpose should be present in request body'
    ).exists(),
    check(
      '*.company_name',
      'company_name should be present in request body'
    ).exists(),
    check('*.position', 'position should be present in request body').exists(),
    check(
      '*.company_address',
      'company_address should be present in request body'
    ).exists(),
    check(
      '*.company_phone',
      'company_phone should be present in request body'
    ).exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    occupationService.put(req, res);
  }
);

router.delete('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  occupationService.remove(req, res);
});

module.exports = router;
