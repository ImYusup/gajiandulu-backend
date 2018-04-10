require('module-alias/register');
const { access_tokens: accessTokenModel, users: userModel } = require('@models');
const response = require('./response');
const jwtHelpers = require('./jwt');

const authAdmin = async (req, res, next) => {
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
    const admin = jwtHelpers.verifyJWT(token);
    const admins = await userModel.findOne({where: { id: admin.id }});
    res.local = {};
    
    if (admins.role_id === 1) {
      // Later if you need admin email or id
      // just get res.local.admins
      res.local.admins = {
        email: admin.email,
        id: admin.id
      };
    } else {
      return res.status(403).json(response(false, 'You are not allowed to access this route'));
    }
  } catch (error) {
    return res.status(403).json(response(false, error.message));
  }
  next();
};

module.exports = authAdmin;
