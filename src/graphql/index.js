const { makeExecutableSchema } = require('graphql-tools');
const { employees } = require('./queries');
const typeDefs = require('./types');

// The resolvers,
const resolvers = {
  Query: {
    employees: () => employees
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
