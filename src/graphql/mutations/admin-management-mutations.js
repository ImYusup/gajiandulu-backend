require('module-alias/register');
const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql');

const { response } = require('@helpers');
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
    date_of_birth: {
      type: GraphQLNonNull(GraphQLString)
    },
    password: {
      type: GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root, args) {
    const { full_name, email, phone, date_of_birth, password } = args;

    const hashPassword = crypt.hashSync(password, 15);
    const hash = crypt.hashSync(new Date().toString() + email, 10);
    const dataInsert = Object.assign(
      {},
      {
        full_name,
        email,
        password: hashPassword,
        date_of_birth,
        phone,
        hash,
        is_confirmed_email: 1,
        role_id: 1,
        registration_complete: 1
      }
    );
    // YOU SHOULD remember that we only to create admin data, there should be role_id = 1
    const results = await UserModel.create(dataInsert);
    if (results) {
      return results;
    } else {
      return root
        .status(400)
        .json(response(false, 'failed to insert to database'));
    }
  }
};

// const updateUdmin
const updateAdmin = {
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
    },
    password: {
      type: GraphQLString
    }
  },

  async resolve(root, args) {
    // YOU SHOULD remember that we only to create admin data, there should be role_id = 1
    return await UserModel.findById(args.id).then((result, error) => {
      if (result) {
        const hash = crypt.hashSync(new Date().toString() + args.email || result.dataValues.email, 10);
        const data = Object.assign({}, args, { hash: hash });
        return result.update(data);
      } else {
        return root
          .status(400)
          .json(response(false, 'admin id not found', error));
      }
    });
  }
};

const deleteAdmin = {
  type: UserType,
  description: 'delete admin',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(root, args) {
    // YOU SHOULD remember that we only to create admin data, there should be role_id = 1
    const destroy = await UserModel.destroy({ where: { id: args.id } });
    if (destroy) {
      root.status(200).json(response(true, 'admin deleted successfully'));
    }
  }
};

module.exports = { createAdmin, updateAdmin, deleteAdmin };
