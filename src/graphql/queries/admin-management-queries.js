require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');

const { users: UserModel } = require('@models');
const UserType = require('../types/users');

const admin = {
  type: new GraphQLList(UserType),
  description: 'get users by specific ID',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve(root, args) {
    // YOU SHOULD remember that we only to get admin data, there should be role_id = 1
    const results = await UserModel.findAll({where: {id:args.id, role_id:1}});
    return results;
  }
};

const admins = {
  type: new GraphQLList(UserType),
  description: 'get all users',
  // YOU SHOULD remember that we only to get admin data, there should be role_id = 1
  async resolve(root, args) {
    const results = await UserModel.findAll({where: {role_id:1}});
    return results;
  }
};

module.exports = { admin, admins };
