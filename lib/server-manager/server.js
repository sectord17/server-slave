const ServerGame = require('../apis/server-game');

module.exports = class Server {
    constructor(id, url, httpPort, gamePort) {
        this.id = id;
        this.url = url;
        this.httpPort = httpPort;
        this.gamePort = gamePort;
        this.api = new ServerGame(url + ':' + httpPort);
    }
};