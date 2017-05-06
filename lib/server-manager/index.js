const Server = require('./server');
const fork = require('child_process').fork;
const portfinder = require('portfinder');

module.exports = function () {
    let servers = new Map();

    const getServerOrFail = function (serverId) {
        const server = servers.get(serverId);

        if (server) {
            return server;
        }

        throw new Error("model-not-found");
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
            return resolve(server);
        })
    };

    const destroy = function (server) {
        return new Promise(function (resolve) {
            server.childProcess.kill();
            return resolve(server);
        });
    };

    return {
        bootstrapGameInstance(serverId) {
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

        destroyGameInstance(serverId) {
            const server = getServerOrFail(serverId);

            return destroy(server)
                .then(server => {
                    servers.delete(server.id);
                    return server;
                });
        },

        joinPlayer(serverId) {
            return getServerOrFail(serverId).api.join();
        }
    }
};