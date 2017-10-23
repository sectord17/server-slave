global.include = function (file) {
    return require(__dirname + '/..' + file);
};

const GameManager = require('./game-manager');
const ServerHTTP = require('./server-http');

const gameManager = new GameManager(
    process.env.SERVER_GAME_PATH, process.env.SERVER_GAME_IP, process.env.SERVER_GAME_TOKEN
);
const serverHTTP = new ServerHTTP(process.env.PORT);

module.exports = {
    gameManager,
    serverHTTP
};

require('./cli');
serverHTTP.start();