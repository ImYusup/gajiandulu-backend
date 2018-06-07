require('module-alias/register');
const { GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const { employees: EmployeeModel } = require('@models');
const EmployeeType = require('../types/employee_types');

const employee = {
  type: new GraphQLList(EmployeeType),
  description: 'get employee by specific ID',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve({ req, res }, args) {
    const results = EmployeeModel.findAll();
    return results;
  }
};

const employees = {
  type: new GraphQLList(EmployeeType),
  description: 'get all employees',
  async resolve({ req, res }, args) {
    const results = EmployeeModel.findAll();
    return results;
  }
};

module.exports = { employee, employees };

//{ where: { id: args.id, role_id: 3 } })
//{ where: { role_id: 3 } }
