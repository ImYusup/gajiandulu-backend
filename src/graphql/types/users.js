const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql');
// // const models = require('../../models/index.js');
// const { roles: RoleModel } = require('@models');

const RoleType = require('./roles');
const { roles: RoleModel } = require('@models');

module.exports = new GraphQLObjectType({
  name: 'users',
  description: 'users data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(users) {
          return users.id;
        }
      },
      full_name: {
        type: GraphQLString,
        resolve(users) {
          return users.full_name;
        }
      },
      email: {
        type: GraphQLString,
        resolve(users) {
          return users.email;
        }
      },
      pin: {
        type: GraphQLString,
        resolve(users) {
          return users.pin;
        }
      },
      date_of_birth: {
        type: GraphQLString,
        resolve(users) {
          return users.date_of_birth;
        }
      },
      phone: {
        type: GraphQLString,
        resolve(users) {
          return users.phone;
        }
      },
      hash: {
        type: GraphQLString,
        resolve (users) {
          return users.hash;
        }
      },
      role_id: {
        type: GraphQLList(RoleType),
        async resolve(users) {
          return await RoleModel.findAll({where: { id: users.role_id }});
        }
      },
      currency: {
        type: GraphQLString,
        resolve(users) {
          return users.currency;
        }
      }
    };
  }
});
