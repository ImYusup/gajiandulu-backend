require('module-alias/register');
const { access_tokens: accessTokenModel, users: userModel } = require('@models');
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
    const users = userModel.findOne({where: { id: user.id }});
    res.local = {};

    if (users.role_id.toString() === '2') {
      // Later if you need user email or id
      // just get res.local.users
      res.local.users = {
        email: user.email,
        id: user.id
      };
    } else {
      return res.status(403).json(response(false, 'You are not allowed to access this route'));
    }
  } catch (error) {
    return res.status(403).json(response(false, error.message));
  }
  next();
};

module.exports = auth;
