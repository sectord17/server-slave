const Server = require('./server');

module.exports = function (app) {
    let servers = [];

    let getServerIndexById = function (serverId) {
        for (let i = 0; i < servers.length; ++i) {
            if (servers[i].id === serverId) {
                return i;
            }
        }

        return null;
    };

    let getUnoccupiedPort = function () {
        return 20000;
    };

    let bootstrap = function (server) {
        // TODO: Bootstraping unix game instance
    };

    let destroy = function (server) {
        // TODO: Destroying unix game instance
    };

    return {
        bootstrapGameInstance(serverId) {
            let httpPort = getUnoccupiedPort();
            let gamePort = getUnoccupiedPort();

            let server = new Server(serverId, process.env.SERVER_GAME_URL, httpPort, gamePort);

            bootstrap(server);

            servers.push(server);
        },

        destroyGameInstance(serverId) {
            let serverIndex = getServerIndexById(serverId);
            let server = servers[serverIndex];

            destroy(server);

            servers.splice(serverIndex, 1);
        }
    }
};