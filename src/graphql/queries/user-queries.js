require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const { users: UserModel } = require('@models');
const UserType = require('../types/users');

const user = {
  type: new GraphQLList(UserType),
  description: 'get users by specific ID',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve({ req, res }, args) {
    const results = UserModel.findAll({ where: { id: args.id, role_id: 2 } });
    return results;
  }
};

const users = {
  type: new GraphQLList(UserType),
  description: 'get all users',
  async resolve({ req, res }, args) {
    const results = UserModel.findAll({ where: { role_id: 2 } });
    return results;
  }
};

module.exports = { user, users };
