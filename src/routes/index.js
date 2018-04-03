const register = require('./register');
const login = require('./login');
const users = require('./users');
const family = require('./families');
const identityCard = require('./identity-cards');
const occupation = require('./occupations');
const me = require('./me');
const digitalAsset = require('./digital-assets');
const feedback = require('./feedbacks');
const promo = require('./promos');

const loan = require('./loans');

const forgotPassword = require('./forgot-password');
const bankData = require('./bank-data');

module.exports = {
  register,
  login,
  users,
  family,
  identityCard,
  occupation,
  me,
  digitalAsset,
  feedback,
  loan,
  forgotPassword,
  promo,
  bankData
};
