const Server = require('./server');
const fork = require('child_process').fork;
const portfinder = require('portfinder');
const winston = require('winston');
const BasicError = require('../errors/basic-error');
const ModelNotFoundError = require('../errors/model-not-found-error');

module.exports = () => {
    /**
     * @type {Map<string, Server>}
     */
    let servers = new Map();

    /**
     * @param {string} serverId
     * @returns {Promise.<Server>}
     */
    const getServer = serverId => {
        return new Promise((resolve, reject) => {
            const server = servers.get(serverId);

            if (server) {
                return resolve(server);
            }

            return reject(new ModelNotFoundError("server"));
        });
    };

    /**
     * @param {Server} server
     * @returns {Promise.<Server>}
     */
    const bootstrap = server => {
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

            winston.log('info', `Server ${server.getInlineDetails()} has started.`);

            return resolve(server);
        })
    };

    /**
     * @param {Server} server
     * @returns {Promise.<Server>}
     */
    const destroy = server => {
        return new Promise(resolve => {
            server.childProcess.on('exit', () => {
                winston.log('info', `Server ${server.getInlineDetails()} has stopped.`);
                resolve(server);
            });
            server.childProcess.kill();
        });
    };

    return {
        /**
         * @returns {Array.<Server>}
         */
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
                .then(server => destroy(server))
                .then(server => bootstrap(server));
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