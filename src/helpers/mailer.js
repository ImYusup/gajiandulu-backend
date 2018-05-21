require('dotenv').config();
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

let auth;
let nodemailerMail;

if (process.env.NODE_ENV === 'development') {
  auth = {
    auth: {
      host: process.env.MAILGUN_HOST,
      port: process.env.MAILGUN_PORT,
      api_key: process.env.MAILGUN_SECRET,
      domain: process.env.MAILGUN_DOMAIN
    }
  };
  nodemailerMail = nodemailer.createTransport(mg(auth));
} else {
  auth = {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'fd992b099d817f',
      pass: '6b564816b97868'
    }
  };
  nodemailerMail = nodemailer.createTransport(auth);
}

module.exports = nodemailerMail;
