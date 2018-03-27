const userService = require('./users/users.service.js');
const accessTokenService = require('./access-tokens/access.tokens.service.js');
const familyService = require('./families/families.service.js');
const identityCardService = require('./identity-cards/identity.cards.service.js');
const occupationService = require('./occupations/occupations.service.js');
const meService = require('./me/me.service.js');
const digitalAssetService = require('./digital-assets/digital.assets.service');
const feedbackService = require('./feedbacks/feedbacks.service.js');
const feedbackConversationService = require('./feedback_conversations/feedback.conversation.service');
const forgotPasswordService = require('./forgot-password/forgot.password.service');
// eslint-disable-next-line no-unused-vars
module.exports = {
  userService,
  familyService,
  accessTokenService,
  identityCardService,
  occupationService,
  meService,
  digitalAssetService,
  feedbackService,
  feedbackConversationService,
  forgotPasswordService 
};
