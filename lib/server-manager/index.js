const ServerGame = require('../apis/server-game');
const Server = require('./server');

module.exports = function (app) {
    let servers = [];
    let game = new ServerGame(process.env.SERVER_GAME_HTTPURL);

    let getUnoccupiedPort = function () {
        return 20000;
    };

    let bootstrap = function (server) {
        // TODO: Bootstraping unix game instance
    };

    return {
        bootstrapGameInstance(serverId) {
            let httpPort = getUnoccupiedPort();
            let gamePort = getUnoccupiedPort();

            let server = new Server(serverId, process.env.SERVER_GAME_IP, httpPort, gamePort);

            bootstrap(server);

            servers.push(server);
        }
    }
};