module.exports = function (serverManager) {
    let express = require('express'),
        router = express.Router();

    // Store
    router.post('/', function (request, response) {
        // TODO: Request validation

        serverManager.bootstrapGameInstance(request.body.serverId)
            .then(server =>
                response.send({
                    ip: server.ip,
                    port: server.gamePort
                })
            );
    });

    // Destroy
    router.delete('/:serverId', function (request, response) {
        serverManager.destroyGameInstance(request.params.serverId)
            .then(() => response.sendStatus(200));
    });

    // Join
    router.post('/:serverId/join', function (request, response) {
        serverManager.joinPlayer(request.params.serverId)
            .then(token => response.send({token}))
            .catch(() => response.sendStatus(500));
    });

    return router;
};
