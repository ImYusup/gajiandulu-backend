require('module-alias/register');
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

const { response } = require('@helpers');
const { employees: EmployeeModel } = require('@models');
const EmployeeType = require('../types/employee_types');

const createEmployee = {
  type: EmployeeType,
  description: 'create employee ',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    },
    company_id: {
      type: GraphQLNonNull(GraphQLString)
    },
    user_id: {
      type: GraphQLNonNull(GraphQLString)
    },
    role: {
      type: GraphQLNonNull(GraphQLString)
    },
    slary: {
      type: GraphQLNonNull(GraphQLString)
    },
    workdays: {
      type: GraphQLNonNull(GraphQLString)
    },
    daily_salary: {
      type: GraphQLNonNull(GraphQLString)
    },
    flag: {
      type: GraphQLNonNull(GraphQLString)
    },
    active: {
      type: GraphQLNonNull(GraphQLString)
    }
  },
  async resolve({ req, res }, args) {
    const { company_id, user_id, role, salary } = args;
    const dataInsert = Object.assign(
      {},
      {
        company_id,
        user_id,
        role,
        salary
      }
    );
    // YOU SHOULD remember that we only to create admin data, there should be role_id = 1
    const results = await EmployeeModel.create(dataInsert);
    if (results) {
      return results;
    } else {
      return res
        .status(400)
        .json(response(false, 'failed to insert to database'));
    }
  }
};

const deleteEmployee = {
  type: EmployeeType,
  description: 'Delete Employee',
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  async resolve({ req, res }, args) {
    const destroy = await EmployeeModel.destroy({
      where: { id: args.id }
    });
    if (destroy) {
      res.status(200).json(response(true, 'Employee deleted succesfully'));
    } else {
      res.status(400).json(response(false, 'Employee not found'));
    }
  }
};

module.exports = { createEmployee, deleteEmployee };
