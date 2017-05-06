const Server = require('./server');
const fork = require('child_process').fork;
const portfinder = require('portfinder');

module.exports = function () {
    let servers = new Map();

    const getServer = (serverId) => {
        return new Promise((resolve, reject) => {
            const server = servers.get(serverId);

            if (server) {
                return resolve(server);
            }

            return reject(new Error("model-not-found"));
        });
    };

    const bootstrap = (server) => {
        return new Promise((resolve) => {
            const childProcess = fork(process.env.SERVER_GAME_PATH, [], {
                env: {
                    IP: server.ip,
                    HTTP_PORT: server.httpPort,
                    GAME_PORT: server.gamePort
                }
            });

            server.setChildProcess(childProcess);
            return resolve(server);
        })
    };

    const destroy = (server) => {
        return new Promise(function (resolve) {
            server.childProcess.kill();
            return resolve(server);
        });
    };

    return {
        bootstrapGameInstance(serverId) {
            if (servers.has(serverId)) {
                return Promise.reject(new Error("server-exists"));
            }

            return portfinder.getPortPromise()
                .then(httpPort =>
                    portfinder.getPortPromise({port: httpPort + 1})
                        .then(gamePort =>
                            bootstrap(new Server(serverId, process.env.SERVER_GAME_IP, httpPort, gamePort))
                        )
                )
                .then(server => {
                    servers.set(server.id, server);
                    return server;
                });
        },

        restartGameInstance(server) {
            server.childProcess.kill();
            return bootstrap(server);
        },

        destroyGameInstance(serverId) {
            return getServer(serverId)
                .then(server => destroy(server))
                .then(server => {
                    servers.delete(server.id);
                    return server;
                });
        },

        joinPlayer(serverId) {
            return getServer(serverId)
                .then(server => server.api.join());
        }
    }
};