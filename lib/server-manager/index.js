const fork = require('child_process').fork;
const portfinder = require('portfinder');
const winston = require('winston');
const Server = require('./server');
const BasicError = include('/lib/errors/basic-error');
const ModelNotFoundError = include('/lib/errors/model-not-found-error');

module.exports = exports = class ServerManager {
    constructor() {
        this.servers = new Map();
    }

    _getServer(serverId) {
        return new Promise((resolve, reject) => {
            const server = this.servers.get(serverId);

            if (server) {
                return resolve(server);
            }

            return reject(new ModelNotFoundError("server"));
        });
    }

    /**
     * @param {Server} server
     * @returns {Promise.<Server>}
     */
    _bootstrap(server) {
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
    }

    /**
     * @param {Server} server
     * @returns {Promise.<Server>}
     */
    _destroy(server) {
        return new Promise(resolve => {
            server.childProcess.on('exit', () => {
                winston.log('info', `Server ${server.getInlineDetails()} has stopped.`);
                resolve(server);
            });
            server.childProcess.kill();
        });
    }

    /**
     * @returns {Array}
     */
    all() {
        return Array.from(this.servers.values());
    }

    /**
     * @param {int} serverId
     * @returns {Promise.<Server>}
     */
    bootstrapGameInstance(serverId) {
        if (this.servers.has(serverId)) {
            return Promise.reject(new BasicError("server-exists"));
        }

        return portfinder.getPortPromise()
            .then(httpPort =>
                portfinder.getPortPromise({port: httpPort + 1})
                    .then(gamePort =>
                        this._bootstrap(new Server(serverId, process.env.SERVER_GAME_IP, httpPort, gamePort))
                    )
            )
            .then(server => {
                this.servers.set(server.id, server);
                return server;
            });
    }

    /**
     * @param {int} serverId
     * @returns {Promise.<Server>}
     */
    restartGameInstance(serverId) {
        return this._getServer(serverId)
            .then(server => Promise.all([server, server.childProcess.kill()]))
            .then(([server]) => this._bootstrap(server));
    }

    /**
     * @param {int} serverId
     * @returns {Promise.<Server>}
     */
    destroyGameInstance(serverId) {
        return this._getServer(serverId)
            .then(server => this._destroy(server))
            .then(server => {
                this.servers.delete(server.id);
                return server;
            });
    }

    /**
     * @param {int} serverId
     * @returns {Promise.<string>}
     */
    makePlayerDecided(serverId) {
        return this._getServer(serverId).then(server => server.api.decide());
    }
};
