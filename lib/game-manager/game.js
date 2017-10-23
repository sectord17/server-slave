const GameSDK = include('/lib/apis/game-sdk');
const GameListener = require('./game-listener');

module.exports = exports = class Game {
    constructor(id, ip, httpPort, gamePort, token) {
        this.id = id;
        this.ip = ip;
        this.httpPort = httpPort;
        this.gamePort = gamePort;
        this.token = token;
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