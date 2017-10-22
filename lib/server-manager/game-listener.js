const winston = require('winston');
const debug = require('debug')('sectord17-slave:game-listener');

module.exports = exports = class GameListener {
    /**
     * @param {Server} server
     */
    constructor(server) {
        const {serverManager} = include('/lib');
        this.server = server;
        this.serverManager = serverManager;
    }

    listen() {
        const childProcess = this.server.childProcess;

        childProcess.on('exit', () => this.onShutdown());
        childProcess.on('message', message => {
            if (message.event === 'no-players') {
                return this.handleNoPlayers();
            }

            debug(`Unknown message event [${message.event}]`);
            debug(message);
        });
    }

    handleNoPlayers() {
        this.serverManager
            .shutdownGameServer(this.server.id)
            .catch(error => debug(error));
    }

    onShutdown() {
        winston.log('info', `Server ${this.server.getInlineDetails()} has stopped.`);
    }
};