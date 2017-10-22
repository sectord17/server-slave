const fork = require('child_process').fork;
const portfinder = require('portfinder');
const winston = require('winston');
const Server = require('./server');
const BasicError = include('/lib/errors/basic-error');
const ModelNotFoundError = include('/lib/errors/model-not-found-error');

module.exports = exports = class ServerManager {
    /**
     * @param {string} serverPath
     * @param {string} serverIp
     * @param {string} serverToken
     */
    constructor(serverPath, serverIp, serverToken) {
        this.servers = new Map();
        this.serverPath = serverPath;
        this.serverIp = serverIp;
        this.serverToken = serverToken;
    }

    /**
     * @returns {Array.<Server>}
     */
    all() {
        return Array.from(this.servers.values());
    }

    /**
     * @param {int} serverId
     * @returns {Promise.<Server>}
     */
    bootstrapGameServer(serverId) {
        if (this.servers.has(serverId)) {
            return Promise.reject(new BasicError("server-exists"));
        }

        return portfinder.getPortPromise()
            .then(httpPort => Promise.all([httpPort, portfinder.getPortPromise({port: httpPort + 1})]))
            .then(([httpPort, gamePort]) => {
                const server = new Server(serverId, this.serverIp, httpPort, gamePort, this.serverToken);

                this._bootstrap(server);
                this.servers.set(server.id, server);

                return server;
            });
    }

    /**
     * @param {int} serverId
     * @returns {Promise.<Server>}
     */
    restartGameServer(serverId) {
        return this._getServer(serverId)
            .then(server => this._shutdown(server))
            .then(server => this._bootstrap(server));
    }

    /**
     * @param {int} serverId
     * @returns {Promise.<Server>}
     */
    shutdownGameServer(serverId) {
        return this._getServer(serverId)
            .then(server => this._shutdown(server))
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
        return this._getServer(serverId).then(server => server.sdk.decide());
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
     * @returns {Server}
     * @private
     */
    _bootstrap(server) {
        const childProcess = fork(this.serverPath, [], {
            env: {
                IP: server.ip,
                HTTP_PORT: server.httpPort,
                GAME_PORT: server.gamePort,
                DEBUG: process.env.DEBUG
            }
        });

        server.setChildProcess(childProcess);

        winston.log('info', `Server ${server.getInlineDetails()} has started.`);

        return server;
    }

    /**
     * @param {Server} server
     * @returns {Promise.<Server>}
     */
    _shutdown(server) {
        return new Promise((resolve, reject) => {
            server.childProcess.on('exit', () => resolve(server));
            server.sdk.shutdown().catch(error => reject(error));
        });
    }
};
