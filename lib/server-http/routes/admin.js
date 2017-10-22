const express = require('express');

module.exports = () => {
    const {serverManager} = include('/lib');
    const router = express.Router();

    router.post('/servers/restart', (request, response, next) => {
        Promise.all(
            serverManager.all().map(server => serverManager.restartGameServer(server.id))
        )
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    router.post('/servers/:serverId/restart', (request, response, next) => {
        const serverId = request.params.serverId;

        serverManager.restartGameServer(serverId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};
