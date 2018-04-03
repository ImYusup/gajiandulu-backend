require('module-alias/register');
const { response } = require('@helpers');
const { promoService } = require('@services');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res) => {
  promoService.find(req, res);
});

router.get('/:id', (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json(response(false, errors.array()));
  }
  promoService.get(req, res);
});

router.post('/:id', (req, res) => {
  promoService.get(req, res);
});

router.post(
  '/',
  [
    check('*.code','code should be present in request body').exists(),
    check('*.discount','discount should be present in request body').exists(),
    check('*.expired_date','expired data should be presenr in request body').exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json(response(false, errors.array()));
    }
    promoService.create(req, res);
  }
);

router.delete('/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(response(false, errors.array()));
  }
  promoService.remove(req, res);
});

module.exports = router;
