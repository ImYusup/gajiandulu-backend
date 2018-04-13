const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const RoleType = require('./roles');
const OccupationType = require('./occupations');
const FamilyType = require('./families');
const IdentityCardType = require('./identity_cards');
const DigitalAssetType = require('./digital_assets');
const LoanType = require('./loans');
const BankDataType = require('./bank_datas');
const {
  roles: RoleModel,
  occupations: OccupationModel,
  families: FamilyModel,
  identity_cards: IdentityCardModel,
  digital_assets: DigitalAssetModel,
  loans: LoanModel,
  bank_data: BankDataModel
} = require('@models');

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
        resolve(users) {
          return users.hash;
        }
      },
      is_confirmed_email: {
        type: GraphQLInt,
        resolve(users) {
          return users.is_confirmed_email;
        }
      },
      role_id: {
        type: GraphQLList(RoleType),
        async resolve(users) {
          return await RoleModel.findAll({ where: { id: users.role_id } });
        }
      },
      currency: {
        type: GraphQLString,
        resolve(users) {
          return users.currency;
        }
      },
      occupations: {
        type: GraphQLList(OccupationType),
        async resolve(users) {
          return await OccupationModel.findAll({
            where: { user_id: users.id }
          });
        }
      },
      bank_accounts: {
        type: GraphQLList(BankDataType),
        async resolve(users) {
          return await BankDataModel.findAll({
            where: { user_id: users.id }
          });
        }
      },
      families: {
        type: GraphQLList(FamilyType),
        async resolve(users) {
          return await FamilyModel.findAll({
            where: { user_id: users.id }
          });
        }
      },
      identity_cards: {
        type: GraphQLList(IdentityCardType),
        async resolve(users) {
          return await IdentityCardModel.findAll({
            where: { user_id: users.id }
          });
        }
      },
      digital_assets: {
        type: GraphQLList(DigitalAssetType),
        async resolve(users) {
          return await DigitalAssetModel.findAll({
            where: { user_id: users.id }
          });
        }
      },
      loans: {
        type: GraphQLList(LoanType),
        async resolve(users) {
          return await LoanModel.findAll({
            where: { user_id: users.id }
          });
        }
      }
    };
  }
});
