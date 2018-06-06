const { makeExecutableSchema } = require('graphql-tools');
const { books } = require('./queries');
const typeDefs = require('./types');

// The resolvers
const resolvers = {
  Query: { books: () => books }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
