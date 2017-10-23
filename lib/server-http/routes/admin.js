const express = require('express');

module.exports = () => {
    const {gameManager} = include('/lib');
    const router = express.Router();

    router.post('/games/restart', (request, response, next) => {
        Promise.all(
            gameManager.all().map(game => gameManager.restartGame(game.id))
        )
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    router.post('/games/:gameId/restart', (request, response, next) => {
        const gameId = request.params.gameId;

        gameManager.restartGame(gameId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};
