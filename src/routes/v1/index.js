const { auth } = require('@helpers');
const express = require('express');

const register = require('./register');
const login = require('./login');
const users = require('./users');
const me = require('./me');
const digitalAsset = require('./digital-assets');
const feedback = require('./feedbacks');
const promo = require('./promos');
const forgotPassword = require('./forgot-password');
const bankData = require('./bank-data');
const companies = require('./companies');
const members = require('./members');

// Declare API Route and API Version
const v1 = express.Router();

v1.use('/register', register);
v1.use('/login', login);
v1.use('/users', auth, users);
v1.use('/me', auth, me);
v1.use('/banks', auth, bankData);
v1.use('/digital-assets', auth, digitalAsset);
v1.use('/feedbacks', auth, feedback);
v1.use('/promos', promo);
v1.use('/forgot-password', forgotPassword);
v1.use('/companies', auth, companies);
v1.use('/members', members);

module.exports = v1;
