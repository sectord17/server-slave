module.exports = class Server {
    constructor(id, ip, httpPort, gamePort) {
        this.id = id;
        this.ip = ip;
        this.httpPort = httpPort;
        this.gamePort = gamePort;
    }
};