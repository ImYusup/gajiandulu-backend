const users = require('./users/users.service.js');
const registerUser = require('./register/register.service.js');
const accessToken = require('./access-tokens/access.tokens.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(registerUser);
  app.configure(accessToken);
};
