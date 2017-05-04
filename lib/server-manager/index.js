const Server = require('./server');
const fork = require('child_process').fork;
const portfinder = require('portfinder');

module.exports = function () {
    let servers = [];

    const getServerIndex = function (serverId) {
        for (let i = 0; i < servers.length; ++i) {
            if (servers[i].id === serverId) {
                return i;
            }
        }

        return null;
    };

    const getServerIndexPromise = function (serverId) {
        return new Promise((resolve, reject) => {
            const serverIndex = getServerIndex(serverId);

            if (serverIndex === null) {
                return reject(new Error("model-not-found"));
            }

            return resolve(serverIndex);
        });
    };

    const getServerPromise = function (serverId) {
        return getServerIndexPromise(serverId)
            .then(serverIndex => servers[serverIndex]);
    };

    const bootstrap = function (server) {
        return new Promise((resolve) => {
            const childProcess = fork(process.env.SERVER_GAME_PATH, [], {
                env: {
                    IP: server.ip,
                    HTTP_PORT: server.httpPort,
                    GAME_PORT: server.gamePort
                }
            });

            server.setChildProcess(childProcess);
            resolve(server);
        })
    };

    const destroy = function (server) {
        return new Promise(function (resolve) {
            server.childProcess.kill();
            resolve(server);
        });
    };

    return {
        serverExists(serverId) {
            return getServerIndex(serverId) !== null;
        },

        bootstrapGameInstance(serverId) {
            return portfinder.getPortPromise()
                .then(httpPort =>
                    portfinder.getPortPromise({port: httpPort + 1})
                        .then(gamePort =>
                            bootstrap(new Server(serverId, process.env.SERVER_GAME_IP, httpPort, gamePort))
                        )
                )
                .then(server => {
                    servers.push(server);
                    return server;
                });
        },

        destroyGameInstance(serverId) {
            return getServerPromise(serverId)
                .then(server => destroy(server))
                .then(server => getServerIndexPromise(server.id))
                .then(serverIndex => {
                    servers.splice(serverIndex, 1);
                    return server;
                });
        },

        joinPlayer(serverId) {
            return getServerPromise(serverId)
                .then(server => server.api.join());
        }
    }
};