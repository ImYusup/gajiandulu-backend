require('module-alias/register');
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

const { response } = require('@helpers');
const { users: UserModel } = require('@models');
const UserType = require('../types/users');

const updateUser = {
  type: UserType,
  description: 'update admin',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    full_name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    },
    date_of_birth: {
      type: GraphQLString
    }
  },
  async resolve({req, res}, args) {
    return await UserModel.findById(args.id).then((result, error) => {
      if (result && result.dataValues.role_id.toString() === '2') {
        const data = Object.assign({}, args);
        return result.update(data);
      } else {
        return res
          .status(400)
          .json(response(false, 'user data not found', error));
      }
    });
  }
};

const deleteUser = {
  type: UserType,
  description: 'Delete User',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  async resolve({req, res}, args) {
    const destroy = await UserModel.destroy({
      where: { id: args.id, role_id: 2 }
    });
    if (destroy) {
      res.status(200).json(response(true, 'User deleted succesfully'));
    } else {
      res.status(400).json(response(false, 'User not found'));
    }
  }
};

module.exports = { updateUser, deleteUser };
