require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DEV_USER,
    password: process.env.DEV_PASS,
    database: process.env.DEV_DATABASE,
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.TEST_USER,
    password: process.env.TEST_PASS,
    database: process.env.TEST_DATABASE || 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.PROD_USER,
    password: process.env.PROD_PASS,
    database: process.env.PROD_DATABASE,
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
