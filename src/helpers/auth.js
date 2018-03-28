require('module-alias/register');
const { access_tokens: accessTokenModel } = require('@models');
const response = require('./response');
const jwtHelpers = require('./jwt');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(403)
      .json(response(false, 'Authorization header is not present'));
  }

  try {
    const token = jwtHelpers.parseToken(authorization);
    const accessToken = await accessTokenModel.findOne({
      where: { access_token: token }
    });
    if (!accessToken) {
      return res
        .status(403)
        .json(response(false, 'Please do login to get a valid access_token'));
    }
    const user = jwtHelpers.verifyJWT(token);
    // Later if you need user email or id
    // just get res.local.users
    res.local = {};
    res.local.users = {
      email: user.email,
      id: user.id
    };
  } catch (error) {
    return res.status(403).json(response(false, error.message));
  }
  next();
};

module.exports = auth;
