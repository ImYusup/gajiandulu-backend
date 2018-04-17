require('module-alias/register');
const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString
} = require('graphql');

const { response } = require('@helpers');
const { occupations: OccupationModel } = require('@models');
const OccupationType = require('../types/occupations');

const updateOccupation = {
  type: OccupationType,
  description: 'Update Occupation User',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    annual_salary_range_max: { type: GraphQLInt },
    annual_salary_range_min: { type: GraphQLInt },
    monthly_salary: { type: GraphQLInt },
    loan_purpose: { type: GraphQLString },
    company_name: { type: GraphQLString },
    position: { type: GraphQLString },
    company_address: { type: GraphQLString },
    name: { type: GraphQLString }
  },
  async resolve(root, args) {
    return await OccupationModel.findById(args.id).then((result, error) => {
      if (result) {
        const data = Object.assign({}, args);
        return result.update(data);
      } else {
        return root
          .status(400)
          .json(response(false, 'Occupation not found', error));
      }
    });
  }
};

module.exports = { updateOccupation };
