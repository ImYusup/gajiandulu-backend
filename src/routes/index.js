const register = require('./register');
const login = require('./login');
const users = require('./users');
const family = require('./families');
const identityCard = require('./identity-cards');
const occupation = require('./occupations');
const me = require('./me');
const digitalAsset = require('./digital-assets');
const FeedbackConversation = require('./feedback-conversations');

module.exports = {
  register,
  login,
  users,
  family,
  identityCard,
  occupation,
  me,
  digitalAsset,
  FeedbackConversation
};
