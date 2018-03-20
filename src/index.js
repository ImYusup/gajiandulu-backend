/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const config = require('config');
const server = app.listen(3000);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(
    'Bibitnomic server started on http://%s:%d',
    config.host,
    config.port
  )
);
