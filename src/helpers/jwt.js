const jwt = require('jsonwebtoken');
const config = require('config');

const options = {
  expiresIn: 3 * 60 * 60,
  issuer: 'bibitnomic-api',
  jwtid: 'bibitnomic.user',
  subject: 'bibitnomic-access-token'
};

const jwtHelpers = {
  /**
   * Sign new jwt token from passed data.
   * @param {Object} data
   */
  createJWT: (data, secret) => {
    try {
      const token = jwt.sign(data, secret, options);
      return token;
    } catch (error) {
      throw Error(error.message);
    }
  },

  /**
   * parse JWT with specified options.
   * @param {String} token
   */
  verifyJWT: token => {
    try {
      return jwt.verify(token, config.authentication.secret, options);
    } catch (error) {
      throw Error(error.message);
    }
  },

  /**
   * Parse authorization header
   * @param {String} token
   */
  parseToken: authToken => {
    let token;
    if ((token = authToken.split(' ')[1])) {
      return token;
    }
    throw Error('invalid token');
  },

  refreshToken: () =>
    Math.random()
      .toString(36)
      .substring(3)
};

module.exports = jwtHelpers;
