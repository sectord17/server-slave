const Server = require('./server');
const fork = require('child_process').fork;
const portfinder = require('portfinder');
const BasicError = require('../errors/basic-error');
const ModelNotFoundError = require('../errors/model-not-found-error');

module.exports = () => {
    let servers = new Map();

    const getServer = (serverId) => {
        return new Promise((resolve, reject) => {
            const server = servers.get(serverId);

            if (server) {
                return resolve(server);
            }

            return reject(new ModelNotFoundError("server"));
        });
    };

    const bootstrap = (server) => {
        return new Promise((resolve) => {
            const childProcess = fork(process.env.SERVER_GAME_PATH, [], {
                env: {
                    IP: server.ip,
                    HTTP_PORT: server.httpPort,
                    GAME_PORT: server.gamePort,
                    DEBUG: process.env.DEBUG
                }
            });

            server.setChildProcess(childProcess);
            return resolve(server);
        })
    };

    const destroy = (server) => {
        return new Promise(resolve => {
            server.childProcess.kill();
            return resolve(server);
        });
    };

    return {
        all() {
            return Array.from(servers.values());
        },

        /**
         * @param {string} serverId
         * @returns {Promise.<Server>}
         */
        bootstrapGameInstance(serverId) {
            if (servers.has(serverId)) {
                return Promise.reject(new BasicError("server-exists"));
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

        /**
         * @param {string} serverId
         * @returns {Promise.<Server>}
         */
        restartGameInstance(serverId) {
            return getServer(serverId)
                .then(server => Promise.all([server, server.childProcess.kill()]))
                .then(([server]) => bootstrap(server));
        },

        /**
         * @param {string} serverId
         * @returns {Promise.<Server>}
         */
        destroyGameInstance(serverId) {
            return getServer(serverId)
                .then(server => destroy(server))
                .then(server => {
                    servers.delete(server.id);
                    return server;
                });
        },

        /**
         * @param {string} serverId
         * @returns {Promise.<string>}
         */
        makePlayerDecided(serverId) {
            return getServer(serverId)
                .then(server => server.api.decide());
        }
    }
};