const winston = require('winston');
const debug = require('debug')('sectord17-slave:game-listener');

module.exports = exports = class GameListener {
    /**
     * @param {Game} game
     */
    constructor(game) {
        const {gameManager} = include('/lib');
        this.game = game;
        this.gameManager = gameManager;
    }

    listen() {
        const childProcess = this.game.childProcess;

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
        this.gameManager
            .shutdownGame(this.game.id)
            .catch(error => debug(error));
    }

    onShutdown() {
        winston.log('info', `Game ${this.game.getInlineDetails()} has stopped.`);
    }
};