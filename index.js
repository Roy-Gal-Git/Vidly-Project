const winston = require('winston');
const express = require('express');
app = express();

require('./startup/logging.js')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => { winston.info(`Listening on port ${port}...`); });
