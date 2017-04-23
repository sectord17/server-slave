const ServerGame = require('../apis/server-game');

module.exports = function (app) {
    let game = new ServerGame(process.env.SERVER_GAME_HTTPURL);

    return {

    }
};