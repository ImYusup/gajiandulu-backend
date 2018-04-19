require('module-alias/register');
const { GraphQLList } = require('graphql');

const { users: UserModel } = require('@models');
const UserType = require('../types/users');

const getAdmins = {
  type: new GraphQLList(UserType),
  description: 'get all users',
  // YOU SHOULD remember that we only to get admin data, there should be role_id = 1
  async resolve({req, res}, args) {
    const results = await UserModel.findAll({where: {role_id:1}});
    return results;
  }
};

module.exports = { getAdmins };
