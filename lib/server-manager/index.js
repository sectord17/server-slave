const Server = require('./server');
const fork = require('child_process').fork;
const portfinder = require('portfinder');

module.exports = function () {
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

    let destroy = function (server) {
        return new Promise(function (resolve, reject) {
            server.childProcess.kill();
            resolve(server);
        });
    };

    return {
        bootstrapGameInstance(serverId) {
            return new Promise(function (resolve, reject) {
                portfinder.getPortPromise()
                    .then(httpPort =>
                        portfinder.getPortPromise({port: httpPort + 1})
                            .then(gamePort =>
                                bootstrap(new Server(serverId, process.env.SERVER_GAME_IP, httpPort, gamePort))
                            )
                    )
                    .then(server => {
                        servers.push(server);
                        resolve(server);
                    });
            });
        },

        destroyGameInstance(serverId) {
            return new Promise(function (resolve, reject) {
                destroy(servers[getServerIndexById(serverId)])
                    .then(server => {
                        let serverIndex = getServerIndexById(serverId);
                        servers.splice(serverIndex, 1);
                        resolve(server);
                    });
            });
        },

        joinPlayer(serverId) {
            let server = servers[getServerIndexById(serverId)];

            return server.api.join();
        }
    }
};