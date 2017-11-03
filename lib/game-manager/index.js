const fork = require('child_process').fork;
const portfinder = require('portfinder');
const winston = require('winston');
const Game = require('./game');
const BasicError = include('/lib/errors/basic-error');
const ModelNotFoundError = include('/lib/errors/model-not-found-error');

module.exports = exports = class GameManager {
    /**
     * @param {MasterSDK} masterSDK
     * @param {string} gameScriptPath
     * @param {string} gameIp
     * @param {string} gameToken
     */
    constructor(masterSDK, gameScriptPath, gameIp, gameToken) {
        this.masterSDK = masterSDK;
        this.gameScriptPath = gameScriptPath;
        this.gameIp = gameIp;
        this.gameToken = gameToken;
        this.games = new Map();
    }

    /**
     * @returns {Array.<Game>}
     */
    all() {
        return Array.from(this.games.values());
    }

    /**
     * @param {int} id
     * @param {string} name
     * @returns {Promise.<Game>}
     */
    bootstrapGame(id, name) {
        if (this.games.has(id)) {
            return Promise.reject(new BasicError("game-exists"));
        }

        return portfinder.getPortPromise()
            .then(httpPort => Promise.all([httpPort, portfinder.getPortPromise({port: httpPort + 1})]))
            .then(([httpPort, gamePort]) => {
                const game = new Game(id, name, this.gameIp, httpPort, gamePort, this.gameToken);
                return this._bootstrap(game);
            })
            .then(game => {
                this.games.set(game.id, game);
                return game;
            });
    }

    /**
     * @param {int} id
     * @returns {Promise.<Game>}
     */
    restartGame(id) {
        return this._getGame(id)
            .then(game => this._shutdown(game))
            .then(game => this._bootstrap(game));
    }

    /**
     * @param {int} id
     * @returns {Promise.<Game>}
     */
    shutdownGame(id) {
        return this._getGame(id)
            .then(game => this._shutdown(game))
            .then(game => this.onShutdownGame(game));
    }

    /**
     * @param {Game} game
     * @returns {Promise.<Game>}
     */
    onShutdownGame(game) {
        this.games.delete(game.id);

        winston.log('info', `Game ${game.getInlineDetails()} has stopped.`);

        return this.masterSDK
            .informGameShutdown(game)
            .then(() => game);
    }

    /**
     * @param {int} id
     * @returns {Promise.<string>}
     */
    makePlayerDecided(id) {
        return this._getGame(id).then(game => game.sdk.decide());
    }

    _getGame(id) {
        return new Promise((resolve, reject) => {
            const game = this.games.get(id);

            if (game) {
                return resolve(game);
            }

            return reject(new ModelNotFoundError("game"));
        });
    }

    /**
     * @param {Game} game
     * @returns {Promise.<Game>}
     * @private
     */
    _bootstrap(game) {
        return new Promise(resolve => {
            const childProcess = fork(this.gameScriptPath, [], {
                env: {
                    HTTP_PORT: game.httpPort,
                    GAME_PORT: game.gamePort,
                    DEBUG: process.env.DEBUG
                }
            });

            game.setChildProcess(childProcess);

            childProcess.on('message', message => {
                if (message.event === 'booted') {
                    resolve(game);
                    // TODO: Remove listener
                }
            });

            winston.log('info', `Game ${game.getInlineDetails()} is booting...`);
        });
    }

    /**
     * @param {Game} game
     * @returns {Promise.<Game>}
     */
    _shutdown(game) {
        return new Promise((resolve, reject) => {
            game.childProcess.on('exit', () => resolve(game));
            game.sdk.shutdown().catch(error => reject(error));
        });
    }
};
