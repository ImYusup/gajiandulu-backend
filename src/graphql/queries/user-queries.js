require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');

const { users: UserModel } = require('@models');
const UserType = require('../types/users');

const user = {
  type: new GraphQLList(UserType),
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve(root, args) {
    const results = UserModel.findAll({where: {id:args.id}});
    return results;
  }
};

module.exports = { user };
