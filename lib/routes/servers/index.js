module.exports = function (app) {
    let express = require('express'),
        router = express.Router();

    // Store
    router.post('/', function (request, response) {
        // TODO: Request validation

        app.serverManager.bootstrapGameInstance(request.body.serverId)
            .then(server => {
                response.send({
                    ip: server.ip,
                    port: server.httpPort
                });
            });
    });

    // Destroy
    router.delete('/:serverId', function (request, response) {
        app.serverManager.destroyGameInstance(request.params.serverId)
            .then(server => {
                response.sendStatus(200);
            });
    });

    // Join
    router.post('/:serverId/join', function (request, response) {
        app.serverManager.assignPlayer(request.params.serverId)
            .then(data => {
                response.send({
                    token: data.token
                })
            })
            .catch(() => {
                response.sendStatus(500);
            });
    });

    return router;
};
