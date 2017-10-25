const GameSDK = include('/lib/apis/game-sdk');
const GameListener = require('./game-listener');

module.exports = exports = class Game {
    constructor(id, ip, httpPort, gamePort, token) {
        this.id = parseInt(id);
        this.ip = ip;
        this.httpPort = parseInt(httpPort);
        this.gamePort = parseInt(gamePort);
        this.token = token;
        this.playersCount = 0;

        this.sdk = null;
        this.childProcess = null;
        this.listener = null;
    }

    setChildProcess(childProcess) {
        this.childProcess = childProcess;
        this.sdk = new GameSDK(this.ip, this.httpPort, this.token, childProcess);
        this.listener = new GameListener(this);
        this.listener.listen();
    }

    getInlineDetails() {
        return `#${this.id} <${this.ip}, ${this.httpPort}/${this.gamePort}>`;
    }
};