require('module-alias/register');
// const path = require('path');
// const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const { /** authAdmin , */ notFound } = require('@helpers');
const routes = require('./routes');
const adminSchema = require('./graphql');

const app = express();

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(favicon(path.join(config.public), 'favicon.ico'));
// Host the public folder
// app.use('/', express.static(config.public));
app.use('/uploads', express.static(config.uploads));

// Route for API
// auth is middleware for authentication
// Initiate Admin GraphQl Endpoint
app.use(
  '/admin',
  // authAdmin, // enable Authentification for admin here
  bodyParser(),
  graphqlExpress({
    schema: adminSchema
  })
);
// Initiate GraphiQL Endpoint on Development ENV
if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/admin' }));
}

// API Version
app.use('/api/v1', routes.v1);

app.use(notFound());

module.exports = app;
