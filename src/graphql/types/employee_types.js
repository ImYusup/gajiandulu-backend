const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'employee_types',
  description: 'employee data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(employee) {
          return employee.id;
        }
      },
      company_id: {
        type: GraphQLString,
        resolve(employee) {
          return employee.company_id;
        }
      },
      user_id: {
        type: GraphQLString,
        resolve(employee) {
          return employee.user_id;
        }
      },
      role: {
        type: GraphQLString,
        resolve(employee) {
          return employee.role;
        }
      },
      salary: {
        type: GraphQLString,
        resolve(employee) {
          return employee.salary;
        }
      },
      workdays: {
        type: GraphQLString,
        resolve(employee) {
          return employee.workdays;
        }
      },
      daily_salary: {
        type: GraphQLString,
        resolve(employee) {
          return employee.daily_salary;
        }
      },
      flag: {
        type: GraphQLInt,
        resolve(employee) {
          return employee.flag;
        }
      },
      active: {
        type: GraphQLString,
        resolve(employee) {
          return employee.active;
        }
      }
    };
  }
});
