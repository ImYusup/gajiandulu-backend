require('module-alias/register');
const { response } = require('@helpers');
const { users: User } = require('@models');
const crypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const forgotPasswordService = {
  /**
   * Forgot password
   *
   */
  create: async (req, res) => {
    const { email, hash } = req.body;
    try {
      const user = await User.findOne({ where: { email: email } });
      const passgen =  randomstring.generate(8);
      const hashPassword = crypt.hashSync(passgen, 15);

      if (user === null) {
        return res.status(400).json(response(false, 'User email not found!'));
      }

      // crypt.compareSync(hash, user.hash)
      if (hash === user.hash) {
        try{
          if(user.registration_complete == 1){
            const results = await User.update(
              {
                password: hashPassword
              },
              { where: { email: email, hash: hash } }
            );
            if(results){
              var auth = {
                host: 'smtp.mailtrap.io',
                port: 2525,
                auth: {
                  user: 'fd992b099d817f',
                  pass: '6b564816b97868'
                }
              };
              
              var nodemailerMail = nodemailer.createTransport(auth);
              
              nodemailerMail.sendMail({
                from: 'huda@gajiandulu.com',
                to: user.email, // An array if you have multiple recipients.
                subject: 'Password Reset - GAJIANDULU',
                'h:Reply-To': 'reply2this@company.com',
                //You can use "html:" to send HTML email content. It's magic!
                html: '<b>Password reset succesfully.</b> Your new password is ' + passgen,
              }, function (err, info) {
                if (err) {
                  return res
                    .status(400)
                    .json(
                      response(
                        false,
                        'Failed to send email, please reset password again',
                        err
                      )
                    );
                }
                else {
                  return res
                    .status(200)
                    .json(
                      response(
                        true,
                        'Password successfully reset, please check your email'
                      )
                    );
                }
              });
            } else {
              return res
                .status(400)
                .json(
                  response(
                    false,
                    'Failed to update password'
                  )
                );
            }
          }
        }catch(error){
          if (error.errors) {
            return res.status(400).json(response(false, error.errors));
          }
          return res.status(400).json(response(false, error.message));
        }
        return res
          .status(200)
          .json(
            response(
              true,
              'You must complete your registration'
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
