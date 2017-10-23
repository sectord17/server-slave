global.include = function (file) {
    return require(__dirname + '/..' + file);
};

const GameManager = require('./game-manager');
const MasterSDK = require('./apis/master-sdk');
const ServerHTTP = require('./server-http');

const masterSDK = new MasterSDK(process.env.MASTER_URL, process.env.MASTER_TOKEN);
const gameManager = new GameManager(
    masterSDK, process.env.SERVER_GAME_PATH, process.env.SERVER_GAME_IP, process.env.SERVER_GAME_TOKEN
);
const serverHTTP = new ServerHTTP(process.env.PORT);

module.exports = {
    masterSDK,
    gameManager,
    serverHTTP
};

require('./cli');
serverHTTP.start();