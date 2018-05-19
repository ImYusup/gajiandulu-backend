require('module-alias/register');
const { response } = require('@helpers');
const {
  companyService,
  companySettingService,
  dashboardService,
  memberService,
  presenceService,
  companyMemberService
} = require('@services/v1');
const express = require('express');
const router = express.Router();
const { check, query, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  companyService.get(req, res);
});

router.get('/:company_id/presences/:presence_id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  presenceService.get(req, res);
});

router.get('/:company_id/presences', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  presenceService.find(req, res);
});

router.post(
  '/',
  [
    check('*.name', 'name should only has chars and space').isLength({
      min: 3
    }),
    check('*.address', 'address should be present').exists(),
    check('*.phone', 'must be phone number')
      .optional({
        nullable: true
      })
      .isMobilePhone('id-ID'),
    check('*.timezone', 'timezone should be present').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    companyService.create(req, res);
  }
);

router.patch('/:company_id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  companyService.patch(req, res);
});

router.get('/:company_id/settings', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  companySettingService.get(req, res);
});

router.post(
  '/:id/settings',
  [
    check(
      '*.notif_presence_overdue',
      'notif presence overdue should not be empty'
    ).exists(),
    check(
      '*.presence_overdue_limit',
      'presence overdue limit should not be empty'
    ).exists(),
    check('*.overwork_limit', 'overwork limit should not be empty').exists(),
    check('*.notif_overwork', 'notif overwork should not be empty').exists(),
    check('*.rest_limit', 'rest limit should not be empty').exists(),
    check(
      '*.notif_work_schedule',
      'notif work schedule should not be empty'
    ).exists(),
    check(
      '*.automated_payroll',
      'automated payroll should not be empty'
    ).exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    companySettingService.create(req, res);
  }
);

router.patch('/:id/settings', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  companySettingService.patch(req, res);
});

router.get(
  '/:id/deposit-summary',
  [
    query('month', 'failed need query month and year').exists(),
    query('year', 'failed need query month and year').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    dashboardService.get(req, res);
  }
);

router.get('/:company_id/members', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  companyMemberService.get(req, res);
});

router.post(
  '/:company_id/members',
  [
    check('*.name', 'name should not be empty').exists(),
    check('*.email', 'email should not be empty').exists(),
    check('*.phone', 'phone should not be empty').exists(),
    check('*.salary', 'salary should not be empty').exists(),
    check('*.role', 'role should not be empty').exists(),
    check('*.flag', 'flag limit should not be empty').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    memberService.create(req, res);
  }
);

module.exports = router;
