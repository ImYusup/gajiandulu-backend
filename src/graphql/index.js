const { makeExecutableSchema } = require('graphql-tools');
const { books, employees, users } = require('./queries');
const typeDefs = require('./types');

// The resolvers
const resolvers = {
  Query: {
    employees: () => employees,
    books: () => books,
    // getAdmins: () => getAdmins,
    users: () => users
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
