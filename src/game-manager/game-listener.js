const debug = require('debug')('sectord17-slave:game-listener');
const winston = require('winston');

module.exports = exports = class GameListener {
    /**
     * @param {Game} game
     */
    constructor(game) {
        const {gameManager} = include('/src');
        this.game = game;
        this.gameManager = gameManager;
    }

    listen() {
        const childProcess = this.game.childProcess;

        childProcess.on('exit', () => this.onShutdown());

        childProcess.on('message', message => {
            if (message.event === 'booted') {
                return this.onBooted();
            }

            if (message.event === 'players-count-changed') {
                return this.onPlayersCountChanged(message.data);
            }

            if (message.event === 'game-status-changed') {
                return this.onGameStatusChanged(message.data);
            }

            debug(`Unknown message event [${message.event}]`);
            debug(message);
        });
    }

    onShutdown() {
        this.gameManager
            .onShutdownGame(this.game)
            .catch(error => debug(error));
    }

    onBooted() {
        winston.log('info', `Game ${this.game.getInlineDetails()} has booted.`);
    }

    onGameStatusChanged(data) {
        debug(`Status changed from ${this.game.status} to ${data.status} on game: ${this.game.getInlineDetails()}`);
        this.game.status = data.status;
    }

    onPlayersCountChanged(data) {
        debug(`Players count changed from ${this.game.playersCount} to ${data.playersCount} on game: ${this.game.getInlineDetails()}`);
        this.game.playersCount = data.playersCount;
    }
};