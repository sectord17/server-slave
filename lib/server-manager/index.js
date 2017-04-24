const Server = require('./server');
const portfinder = require('portfinder');

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

    let bootstrap = function (server) {
        return new Promise(function (resolve, reject) {
            // TODO: Bootstraping unix game instance

            resolve(server);
        })
    };

    let destroy = function (server, onDestroy) {
        return new Promise(function (resolve, reject) {
            // TODO: Destroying unix game instance

            resolve(server);
        });
    };

    return {
        bootstrapGameInstance(serverId) {
            return new Promise(function (resolve, reject) {
                portfinder.getPortPromise().then(httpPort => {
                    portfinder.getPortPromise().then(gamePort => {
                        let server = new Server(serverId, process.env.SERVER_GAME_IP, httpPort, gamePort, app);

                        bootstrap(server)
                            .then(server => {
                                servers.push(server);
                                resolve(server);
                            });
                    });
                });
            });
        },

        destroyGameInstance(serverId) {
            return new Promise(function (resolve, reject) {
                let server = servers[getServerIndexById(serverId)];

                destroy(server)
                    .then(server => {
                        let serverIndex = getServerIndexById(serverId);
                        servers.splice(serverIndex, 1);

                        resolve(server);
                    });
            });
        },

        assignPlayer(serverId) {
            let server = servers[getServerIndexById(serverId)];

            return server.api.assign();
        }
    }
};