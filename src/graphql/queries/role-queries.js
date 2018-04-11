require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const { roles: RoleModel } = require('@models');
const RoleType = require('../types/roles');

const role = {
  type: new GraphQLList(RoleType),
  description: 'get roles by spesific ID',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve(root, args) {
    const results = RoleModel.findAll({ where: { id: args.id } });
    return results;
  }
};

const roles = {
  type: new GraphQLList(RoleType),
  description: ' get all role',
  async resolve(root, args) {
    const results = RoleModel.findAll();
    return results;
  }
};

module.exports = { role, roles };
