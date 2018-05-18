require('module-alias/register');
const { response } = require('@helpers');
const {
  meService,
  feedbackService,
  feedbackConversationService
} = require('@services/v1');
const express = require('express');
const multer = require('multer');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const storage = multer.diskStorage({
  destination: config.uploads,
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 8000000, files: 3 }
}).single('file');

router.get('/feedbacks', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  feedbackService.get(req, res);
});

router.post(
  '/feedbacks',
  [
    check('*.summary', 'feedback summary required')
      .exists()
      .trim(),
    check('*.message', 'feedback message required')
      .exists()
      .trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    feedbackService.create(req, res);
  }
);

/*
 * Feedback Conversation
 */
router.post(
  '/conversation',
  [
    check('*.feedback_id', 'feedback_id should be string').exists(),
    check('*.message', 'your message can not be empty').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    feedbackConversationService.create(req, res);
  }
);

router.put(
  '/',
  [
    check('*.email')
      .optional({ nullable: true })
      .isEmail()
      .withMessage('must be a valid email'),

    check('*.adress', 'adress should be present').exists(),

    check('phone', 'phone number should pe present')
      .exists()
      .matches(/^[\d]+$/i)
      .withMessage('Only number that allowed'),

    check('*.timezone', 'timezone should be present').exists(),

    check('*.birthday').isISO8601(),

    check('*.phone', 'must be phone number')
      .optional({ nullable: true })
      .isMobilePhone('id-ID'),
    check(
      '*.old_password',
      'old password required to change new password'
    ).custom((value, { req }) => {
      if (req.body.data.new_password) {
        return value ? true : false;
      }
      return true;
    }),
    check('*.new_password', 'new password required').custom(
      (value, { req }) => {
        if (req.body.data.old_password) {
          return value ? true : false;
        }
        return true;
      }
    ),
    check(
      '*.new_password_confirmation',
      'new password confirmation must be the same as new password'
    ).custom((value, { req }) => value === req.body.data.new_password),
    check('*.family.name', 'family name required')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (
          req.body.data.family.relative_type &&
          req.body.data.family.address &&
          req.body.data.family.phone
        ) {
          return value ? true : false;
        }
        return true;
      })
      .custom(value => {
        if (value) {
          return value.match(/^([A-z]|\s)+$/gi) ? true : false;
        }
        return true;
      })
      .withMessage('family name must be alphabethical'),
    check('*.family.relative_type', 'family relative type required')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (req.body.data.family.name) {
          return value ? true : false;
        }
        return true;
      })
      .custom(value => {
        if (value) {
          return value.match(/^([A-z]|\s)+$/gi) ? true : false;
        }
        return true;
      })
      .withMessage('family relative type must be alphabethical'),
    check('*.family.address', 'family address required')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (req.body.data.family.name) {
          return value ? true : false;
        }
        return true;
      }),
    check('*.family.phone', 'family phone required')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (req.body.data.family.name) {
          return value ? true : false;
        }
        return true;
      })
      .isMobilePhone('id-ID')
      .withMessage('family phone must be phone number format'),
    check('*.occupation.name', 'occupation name must be alphabethical').custom(
      value => {
        if (value) {
          return value.match(/^([A-z]|\s)+$/gi) ? true : false;
        }
        return true;
      }
    ),
    check(
      '*.occupation.annual_salary_range_min',
      'minimum annual salary range must be numeric'
    )
      .optional({ nullable: true })
      .isInt()
      .isNumeric(),
    check(
      '*.occupation.annual_salary_range_max',
      'maximum annual salary range must be numeric'
    )
      .optional({ nullable: true })
      .isInt()
      .isNumeric(),
    check(
      '*.occupation.current_asset_range_min',
      'minimum current asset range must be numeric'
    )
      .optional({ nullable: true })
      .isInt()
      .isNumeric(),
    check(
      '*.occupation.current_asset_range_max',
      'maximum current asset range must be numeric'
    )
      .optional({ nullable: true })
      .isInt()
      .isNumeric(),
    check('*.occupation.monthly_salary', 'monthly salary must be numeric')
      .optional({ nullable: true })
      .isInt()
      .isNumeric(),
    check(
      '*.occupation.company_name',
      'occupation company name must be alphabethical'
    ).custom(value => {
      if (value) {
        return value.match(/^([A-z]|\s)+$/gi) ? true : false;
      }
      return true;
    }),
    check(
      '*.occupation.position',
      'company position must be alphabethical'
    ).custom(value => {
      if (value) {
        return value.match(/^([A-z]|\s)+$/gi) ? true : false;
      }
      return true;
    }),
    check(
      '*.occupation.company_phone',
      'company phone must be phone number format'
    )
      .optional({ nullable: true })
      .isMobilePhone('id-ID')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    meService.put(req, res);
  }
);
router.patch(
  '/',
  [
    check('*.full_name', ' name should only has chars and space').isLength({
      min: 3
    }),
    check('*.email')
      .optional({ nullable: true })
      .isEmail()
      .withMessage('must be a valid email'),

    check('*.adress', 'adress should be present').exists(),

    check('phone', 'phone number should pe present')
      .exists()
      .matches(/^[\d]+$/i)
      .withMessage('Only number that allowed'),

    check('*.timezone', 'timezone should be present').exists(),

    check('*.birthday').isISO8601(),

    check(
      '*.old_password',
      'old password required to change new password'
    ).custom((value, { req }) => {
      if (req.body.data.new_password) {
        return value ? true : false;
      }
      return true;
    }),

    check('*.new_password', 'new password required').custom(
      (value, { req }) => {
        if (req.body.data.old_password) {
          return value ? true : false;
        }
        return true;
      }
    ),

    check(
      '*.new_password_confirmation',
      'new password confirmation must be the same as new password'
    ).custom((value, { req }) => value === req.body.data.new_password)
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(response(false, errors.array()));
    }
    meService.patch(req, res);
  }
);

router.get('/notifications', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  meService.get(req, res);
});

router.post('/checklog', (req, res) => {
  // Before pass the request to service, we need to handle error
  upload(req, res, function(error) {
    if (error) {
      return res.status(422).json(response(false, error.message));
    }

    if (!req.body.type) {
      return res
        .status(422)
        .json(
          response(
            false,
            'Please specify the type first, type can be checkin or checkout'
          )
          
        );
    }

    if (!req.body.location) {
      return res
        .status(422)
        .json(
          response(
            false,
            'Please specify the location first, in lat and long coordinates'
          )
        );
    }

    meService.checklog(req, res);
  });
});

module.exports = router;
