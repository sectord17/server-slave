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
            debug(`Unknown message event [${message.event}]`);
            debug(message);
        });
    }

    onShutdown() {
        this.gameManager
            .onShutdownGame(this.game)
            .catch(error => debug(error));
    }
};