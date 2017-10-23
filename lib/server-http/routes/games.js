const express = require('express');

module.exports = () => {
    const {gameManager} = include('/lib');
    const router = express.Router();

    // Store
    router.post('/', (request, response, next) => {
        // TODO: Request validation

        const gameId = parseInt(request.body.gameId);

        gameManager.bootstrapGame(gameId)
            .then(game => response.send({
                ip: game.ip,
                port: game.gamePort
            }))
            .catch(error => next(error));
    });

    // Destroy
    router.delete('/:gameId', (request, response, next) => {
        const gameId = parseInt(request.params.gameId);

        gameManager.shutdownGame(gameId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    // Decide
    router.post('/:gameId/decide', (request, response, next) => {
        const gameId = parseInt(request.params.gameId);

        gameManager.makePlayerDecided(gameId)
            .then(token => response.send({token}))
            .catch(error => next(error));
    });

    return router;
};
