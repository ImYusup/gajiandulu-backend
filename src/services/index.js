const userService = require('./users/users.service.js');
const accessTokenService = require('./access-tokens/access.tokens.service.js');
const familyService = require('./families/families.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = {
  userService,
  familyService,
  accessTokenService
};
