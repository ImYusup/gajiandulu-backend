const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = require('graphql');

const RoleType = require('./roles');
const { roles: RoleModel, employees: EmployeeModel } = require('@models');

module.exports = new GraphQLObjectType({
  name: 'employees',
  description: 'employees data',
  fields() {
    return {
      id: {
        type: GraphQLID,
        resolve(employees) {
          return employees.id;
        }
      },
      employees: {
        type: GraphQLString,
        resolve(employees) {
          return EmployeeModel.findOne({
            where: { user_id: employees.id }
          });
        }
      },
      roles: {
        type: GraphQLList(RoleType),
        async resolve(roles) {
          return await RoleModel.findOne({
            where: { roles: roles.role }
          });
        }
      },
      salary: {
        type: GraphQLString,
        resolve(employees) {
          return employees.salary;
        }
      }
    };
  }
});

// company_id: {
//   type: GraphQLString,
//   resolve(employees) {
//     return employees.company_id;
//   }
// },
// user_id: {
//   type: GraphQLString,
//   resolve(employees) {
//     return employees.user_id;
//   }
// },
// role: {
//   type: GraphQLString,
//   resolve(employees) {
//     return employees.role;
//   }
// },
// workdays: {
//   type: GraphQLString,
//   resolve(employees) {
//     return employees.workdays;
//   }
// },
// daily_salary: {
//     type: GraphQLString,
//     resolve(employees) {
//       return employees.daily_salary;
//     }
// },
// flag: {
//     type: GraphQLString,
//     resolve(employees) {
//       return employees.flag;
//     }
// },
// active: {
//     type: GraphQLInt,
//     resolve(employees) {
//       return employees.active;
//     }
// },
