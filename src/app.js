require('module-alias/register');
const { auth, authAdmin, notFound } = require('@helpers');
// const path = require('path');
// const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const express = require('express');
const config = require('config');
const GraphHTTP = require('express-graphql');
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
app.use('/register', routes.register);
app.use('/login', routes.login);
app.use('/users', auth, routes.users);
app.use('/family', auth, routes.family);
app.use('/identity-cards', auth,  routes.identityCard);
app.use('/occupations', auth, routes.occupation);
app.use('/me', auth, routes.me);
app.use('/me/banks', auth, routes.bankData);
app.use('/digital-assets', auth, routes.digitalAsset);
app.use('/feedbacks', auth, routes.feedback);
app.use('/promos', routes.promo);
app.use('/loans', auth, routes.loan);
app.use('/forgot-password', routes.forgotPassword);
app.use('/admins', authAdmin, GraphHTTP((req, res) => ({
  schema: adminSchema,
  rootValue: {req, res},
  pretty: process.env.NODE_ENV !== 'production',
  graphiql: process.env.NODE_ENV !== 'production'
})));
app.use('/companies', routes.companies);

app.use(notFound());

module.exports = app;
