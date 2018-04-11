const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'occupations',
  description: 'occupations data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(occupations) {
          return occupations.id;
        }
      },
      annual_salary_range_max: {
        type: GraphQLInt,
        resolve(occupations) {
          return occupations.annual_salary_range_max;
        }
      },
      annual_salary_range_min: {
        type: GraphQLInt,
        resolve(occupations) {
          return occupations.annual_salary_range_min;
        }
      },
      monthly_salary: {
        type: GraphQLInt,
        resolve(occupations) {
          return occupations.monthly_salary;
        }
      },
      loan_purpose: {
        type: GraphQLString,
        resolve(occupations) {
          return occupations.loan_purpose;
        }
      },
      company_name: {
        type: GraphQLString,
        resolve(occupations) {
          return occupations.company_name;
        }
      },
      position: {
        type: GraphQLString,
        resolve(occupations) {
          return occupations.position;
        }
      },
      company_address: {
        type: GraphQLString,
        resolve(occupations) {
          return occupations.company_address;
        }
      },
      company_phone: {
        type: GraphQLString,
        resolve(occupations) {
          return occupations.company_phone;
        }
      },
      name: {
        type: GraphQLString,
        resolve(occupations) {
          return occupations.name;
        }
      }
    };
  }
});
