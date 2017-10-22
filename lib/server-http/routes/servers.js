const express = require('express');

module.exports = () => {
    const {serverManager} = include('/lib');
    const router = express.Router();

    // Store
    router.post('/', (request, response, next) => {
        // TODO: Request validation

        const serverId = parseInt(request.body.serverId);

        serverManager.bootstrapGameInstance(serverId)
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
        const serverId = parseInt(request.params.serverId);

        serverManager.destroyGameInstance(serverId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    // Decide
    router.post('/:serverId/decide', (request, response, next) => {
        const serverId = parseInt(request.params.serverId);

        serverManager.makePlayerDecided(serverId)
            .then(token => response.send({token}))
            .catch(error => next(error));
    });

    return router;
};
