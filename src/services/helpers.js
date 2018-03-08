const jwt = require('jsonwebtoken');

const jwtHelpers = {};

const options = {
  expiresIn: 3 * 60 * 60,
  issuer: 'bibitnomic-api',
  jwtid: 'bibitnomic.user',
  subject: 'bibitnomic-access-token'
};

/**
 * Sign new jwt token from passed data.
 * @param {Object} data
 */
jwtHelpers.createJWT = (data, secret) => {
  try {
    const token = jwt.sign(data, secret, options);
    return token;
  } catch (error) {
    throw Error(error.message);
  }
};

/**
 * parse JWT with specified options.
 * @param {String} token
 */
jwtHelpers.verifyJWT = token => {
  try {
    const payload = jwt.verify(token, process.env.SECRET, options);
    return payload;
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Parse authorization header
 * @param {String} token
 */
jwtHelpers.parseToken = token => {
  if (token.includes('bearer ')) {
    return token.slice('bearer '.length);
  }
  throw Error('invalid token');
};

jwtHelpers.refreshToken = () =>
  Math.random()
    .toString(36)
    .substring(3);

module.exports = jwtHelpers;
