const ServerGame = require('../apis/server-game');

module.exports = class Server {
    constructor(id, url, httpPort, gamePort, app) {
        this.id = id;
        this.url = url;
        this.httpPort = httpPort;
        this.gamePort = gamePort;
        this.app = app;
        this.api = new ServerGame(url + ':' + httpPort, app);
    }
};