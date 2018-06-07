const books = require('./books');
// const employees = require('./employee_types')
//const users = require('./users')

const typeDefs = [books].join('');

module.exports = typeDefs;
