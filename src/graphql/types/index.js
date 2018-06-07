const employees = require('./employees');
//const employees = require('./employee_types')

const typeDefs = [employees].join('');

module.exports = typeDefs;
