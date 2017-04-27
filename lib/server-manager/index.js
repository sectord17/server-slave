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

    const getServerIndexOrFail = function (serverId) {
        const serverIndex = getServerIndex(serverId);

        if (serverIndex === null) {
            throw "Server not found";
        }

        return serverIndex;
    };

    const bootstrap = function (server) {
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
            server.childProcess.kill();
            resolve(server);
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
                    servers.push(server);
                    return server;
                });
        },

        destroyGameInstance(serverId) {
            return destroy(servers[getServerIndexOrFail(serverId)])
                .then(server => {
                    let serverIndex = getServerIndexOrFail(serverId);
                    servers.splice(serverIndex, 1);
                    return server;
                });
        },

        joinPlayer(serverId) {
            return servers[getServerIndexOrFail(serverId)].api.join();
        }
    }
};