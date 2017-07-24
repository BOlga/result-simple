const express = require('express');
const log4js = require('log4js');
const path = require('path');
const routes = require('./routes/baseRoutes');
const ENVIRONMENTS = require('./constants/envConstants');

const logger = log4js.getLogger();
logger.level = 'trace';

function run(port) {
  const app = express();
  app.use(express.static(path.join(__dirname, '..','..', 'public')));
  routes(app);
  app.listen(port);
  logger.info(`Начало работы сервера. Порт ${port}`);
  logger.info(`Окружение ${ENVIRONMENTS.CURRENT}`);
}

module.exports = {
  run: run
};