require('module-alias/register');
const { response } = require('@helpers');
const { users: User } = require('@models');
const crypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
var randomstring = require("randomstring");

const forgotPasswordService = {
  /**
   * Forgot password
   *
   */
  create: async (req, res) => {
    const { email, hash } = req.body.data;
    // Send this password to email later
    const password = Math.random()
      .toString(36)
      .substring(3);
    try {
      const user = await User.findOne({ where: { email: email } });
      const hashPassword = crypt.hashSync(password, 5);

      if (user === null) {
        return res.status(400).json(response(false, 'User email not found!'));
      }

      // crypt.compareSync(hash, user.hash)
      if (hash === user.hash) {
        var passgen =  randomstring.generate(8);
        var auth = {
          auth: {
            api_key: 'key-4d9b63aeae8c8f075d1ab37c273963d5',
            domain: 'sandboxe207aeefc40140019bd222b370bff1ca.mailgun.org'
          },
          proxy: 'http://root:@localhost:3000' // optional proxy, default is false
        }
        
        var nodemailerMailgun = nodemailer.createTransport(mg(auth));
        
        nodemailerMailgun.sendMail({
          from: 'hudaparodi@example.com',
          to: 'hudaparodi@gmail.com', // An array if you have multiple recipients.
          subject: 'Password Reset - GAJIANDULU',
          'h:Reply-To': 'reply2this@company.com',
          //You can use "html:" to send HTML email content. It's magic!
          html: '<b>Password reset succesfully.</b> Your new password is ' + passgen,
        }, function (err, info) {
          if (err) {
            console.log('Error: ' + err);
          }
          else {
            console.log('Response: ' + info);
          }
        });
        await User.update(
          {
            password: passgen
          },
          { where: { email: email, hash: hash } }
        );
        return res
          .status(200)
          .json(
            response(
              true,
              'Password successfully reset, please check your email'
            )
          );
      }

      return res.status(422).json(response(false, 'hash mismatch'));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = forgotPasswordService;
