import express from 'express';
import log4js from 'log4js';
import path from 'path';

const app = express();
const logger = log4js.getLogger(); 
logger.level = 'trace';
app.use(express.static(path.join(__dirname,'..', 'public')));

app.get('/', (request, response) => { 
    response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

function run(port) {
  app.listen(port);
  logger.trace(`Начало работы сервера. Порт ${port}`);
}


module.exports = {
  application: app,
  run: run,
};