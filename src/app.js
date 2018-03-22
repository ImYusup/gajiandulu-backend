require('module-alias/register');
const { auth, notFound } = require('@helpers');
// const path = require('path');
// const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const express = require('express');

const app = express();

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
// app.use('/', express.static(app.get('public')));

// Route for API
// auth is middleware for authentication
app.use('/register', routes.register);
app.use('/login', routes.login);
app.use('/users', auth, routes.users);
app.use('/family', auth, routes.family);
app.use('/identity-cards', auth, routes.identityCard);
app.use('/occupations', auth, routes.occupation);
app.use('/me', auth, routes.me);

app.use(notFound());

module.exports = app;
