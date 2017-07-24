const { find, values } = require('ramda');

const log4js = require('log4js');
const logger = log4js.getLogger(); 
logger.level = 'trace';

const ENVIRONMENTS = {
    DEV: 'dev',
    PRODUCTION: 'prod'
};

function getEnvironment(env) {
    const env_value = (env||'').trim();
    const environment = find(item => item ===env_value, values(ENVIRONMENTS));
    
    return environment || ENVIRONMENTS.DEV;
}

ENVIRONMENTS.CURRENT = getEnvironment(process.env.NODE_ENV);

module.exports = ENVIRONMENTS;