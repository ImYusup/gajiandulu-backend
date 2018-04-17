const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const AssetsType = require('./digital-assets');
const LoansType = require('./loans');
const { digital_assets: AssetsModel, loans: LoansModel } = require('@models');

module.exports = new GraphQLObjectType({
  name: 'users',
  description: 'users data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve (users) {
          return users.id;
        }
      },
      full_name: {
        type: GraphQLString,
        resolve (users) {
          return users.full_name;
        }
      },
      email: {
        type: GraphQLString,
        resolve (users) {
          return users.email;
        }
      },
      pin: {
        type: GraphQLString,
        resolve (users) {
          return users.pin;
        }
      },
      date_of_birth: {
        type: GraphQLString,
        resolve (users) {
          return users.date_of_birth;
        }
      },
      phone: {
        type: GraphQLString,
        resolve (users) {
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
        type: GraphQLInt,
        resolve (users) {
          return users.role_id;
        }
      },
      currency: {
        type: GraphQLString,
        resolve (users) {
          return users.currency;
        }
      },
      digital_assets: {
        type: GraphQLList(AssetsType),
        resolve(users) {
          return AssetsModel.findAll({ where: { user_id: users.id } });
        }
      },
      loans: {
        type: GraphQLList(LoansType),
        resolve(users) {
          return LoansModel.findAll({ where: { user_id: users.id } });
        }
      }
    };
  }
});
