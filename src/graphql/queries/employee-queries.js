require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const { employees: EmployeeModel } = require('@models');
const EmployeeType = require('../types/employee_types');

const employee = {
  type: new GraphQLList(EmployeeType),
  description: 'get users by specific ID',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve({ req, res }, args) {
    const results = EmployeeModel.findAll({
      where: { id: args.id, role_id: 3 }
    });
    return results;
  }
};

const employees = {
  type: new GraphQLList(EmployeeType),
  description: 'get all employees',
  async resolve({ req, res }, args) {
    const results = EmployeeModel.findAll({ where: { role: 3 } });
    return results;
  }
};

module.exports = { employee, employees };
