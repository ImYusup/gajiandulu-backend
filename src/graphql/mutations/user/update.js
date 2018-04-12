require('module-alias/register');
const { GraphQLNonNull, GraphQLString } = require('graphql');
const { users: UserModel } = require('@models');
const updateUser = require('../../types/users');

const user = {
  type: updateUser,
  args: {
    full_name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    date_of_birth: {
      type: new GraphQLNonNull(GraphQLString)
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
};

module.exports = user;
