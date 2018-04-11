require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');

const crypt = require('bcrypt');
const { users: UserModel } = require('@models');
const UserType = require('../types/users');

const createAdmin = {
  type: UserType,
  description: 'create admin',
  args: {
    full_name: {
      type: GraphQLNonNull(GraphQLString)
    },
    email: {
      type: GraphQLNonNull(GraphQLString)
    },
    phone: {
      type: GraphQLNonNull(GraphQLString)
    },
    birthday: {
      type: GraphQLNonNull(GraphQLString)
    },
    password: {
      type: GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root, args) {
    const { full_name, email, phone, birthday, password } = args;
    
    const hashPassword = crypt.hashSync(password, 15);
    const hash = crypt.hashSync(new Date().toString() + email, 10);
    const dataInsert = Object.assign(
      {},
      {
        full_name,
        email,
        password: hashPassword,
        date_of_birth: birthday,
        phone,
        hash,
        is_confirmed_email: 1,
        role_id: 1,
        registration_complete: 1
      }
    );
    // YOU SHOULD remember that we only to create admin data, there should be role_id = 1
    const results = await UserModel.create(dataInsert);
    return results;
  }
};

const updateAdmins = {
  type: new GraphQLList(UserType),
  description: 'get all users',
  args: {

  },
  // YOU SHOULD remember that we only to update admin data, there should be role_id = 1
  async resolve(root, args) {
    
  }
}

module.exports = { createAdmin };
