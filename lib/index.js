global.include = function (file) {
    return require(__dirname + '/..' + file);
};

const ServerManager = require('./server-manager');
const ServerHTTP = require('./server-http');

const serverManager = new ServerManager();
const serverHTTP = new ServerHTTP(process.env.PORT);

module.exports = {
    serverManager,
    serverHTTP
};

require('./cli');
serverHTTP.start();