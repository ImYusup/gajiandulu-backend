require("module-alias/register");
const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLID
} = require("graphql");

const { response } = require("@helpers");
const crypt = require("bcrypt");
const { users: UserModel } = require("@models");
const UserType = require("../types/users");

const createAdmin = {
  type: UserType,
  description: "create admin",
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

// const updateUdmin
const updateAdmin = {
  type: UserType,
  description: "update admin",
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
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
    const dataUpdate = Object(
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
    const update = await UserModel.findById(args.id).then(result => {
      return result.update({
        full_name,
        email,
        phone,
        birthday,
        password
      });
    });
    return update;
  }
};

const deleteAdmin = {
  type: UserType,
  description: "delete admin",
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(root, args) {
    // YOU SHOULD remember that we only to create admin data, there should be role_id = 1
    const destroy = await UserModel.destroy({ where: { id: args.id } });
    if (destroy) {
      root.status(200).json(response(true, "admin deleted successfully"));
    }
  }
};

module.exports = { createAdmin, updateAdmin, deleteAdmin };
