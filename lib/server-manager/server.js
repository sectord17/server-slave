const ServerGame = require('../apis/server-game');

module.exports = class Server {
    constructor(id, ip, httpPort, gamePort, app) {
        this.id = id;
        this.ip = ip;
        this.httpPort = httpPort;
        this.gamePort = gamePort;
        this.app = app;
        this.api = new ServerGame('http://' + ip + ':' + httpPort, app);
    }
};