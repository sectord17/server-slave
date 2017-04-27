const ServerGame = require('../apis/server-game');

module.exports = class Server {
    constructor(id, ip, httpPort, gamePort) {
        this.id = id;
        this.ip = ip;
        this.httpPort = httpPort;
        this.gamePort = gamePort;
        this.api = new ServerGame('http://' + ip + ':' + httpPort);
        this.childProcess = null;
    }

    setChildProcess(childProcess) {
        this.childProcess = childProcess;
    }
};