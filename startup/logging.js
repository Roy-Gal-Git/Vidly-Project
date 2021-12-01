const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.handleExceptions(
    // new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

  process.on('unhandledRejection', (ex) => {
    process.exit(1);
    throw ex
  });
  process.on('SIGTERM', (signal) => {
    process.exit(1);
  });
  process.on('SIGINT', (signal) => {
    process.exit(1)
  })

  winston.add(winston.transports.File, { filename: 'logfile.log' });
  // winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });
};