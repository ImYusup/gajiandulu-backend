const userService = require('./users/users.service.js');
const accessTokenService = require('./access-tokens/access.tokens.service.js');
const familyService = require('./families/families.service.js');
const identityCardService = require('./identity-cards/identity.cards.service');
const occupationService = require('./occupations/occupations.service');
const digitalAssetService = require('./digital-assets/digital.assets.service');
// eslint-disable-next-line no-unused-vars
module.exports = {
  userService,
  familyService,
  accessTokenService,
  identityCardService,
  occupationService,
  digitalAssetService
};
