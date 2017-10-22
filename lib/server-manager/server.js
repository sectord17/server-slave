const ServerGame = include('/lib/apis/server-game');

module.exports = class Server {
    constructor(id, ip, httpPort, gamePort) {
        this.id = id;
        this.ip = ip;
        this.httpPort = httpPort;
        this.gamePort = gamePort;
        this.api = new ServerGame('http://' + ip + ':' + httpPort, process.env.SERVER_GAME_TOKEN);
        this.childProcess = null;
    }

    setChildProcess(childProcess) {
        this.childProcess = childProcess;
    }

    getInlineDetails() {
        return `#${this.id} <${this.ip}, ${this.httpPort}/${this.gamePort}>`;
    }
};