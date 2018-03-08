const users = require('./users/users.service.js');
const phones = require('./phones/phones.service.js');
const accessToken = require('./access-tokens/access.tokens.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(phones);
  app.configure(accessToken);
};
