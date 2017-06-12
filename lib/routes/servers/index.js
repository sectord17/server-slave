const express = require('express');

module.exports = serverManager => {
    const router = express.Router();

    // Store
    router.post('/', (request, response, next) => {
        // TODO: Request validation

        serverManager.bootstrapGameInstance(request.body.serverId)
            .then(server =>
                response.send({
                    ip: server.ip,
                    port: server.gamePort
                })
            )
            .catch(error => next(error));
    });

    // Destroy
    router.delete('/:serverId', (request, response, next) => {
        serverManager.destroyGameInstance(request.params.serverId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    // Decide
    router.post('/:serverId/decide', (request, response, next) => {
        serverManager.makePlayerDecided(request.params.serverId)
            .then(token => response.send({token}))
            .catch(error => next(error));
    });

    return router;
};
