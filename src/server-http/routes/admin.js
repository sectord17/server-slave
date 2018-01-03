const express = require('express');

module.exports = () => {
    const {gameManager} = include('/src');
    const router = express.Router();

    /**
     * @api {post} /admin/games/restart Restart all games
     * @apiVersion 0.0.1
     * @apiGroup Admin
     *
     * @apiExample {json} Request:
     *      POST /admin/games/restart
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     */
    router.post('/games/restart', (request, response, next) => {
        Promise.all(
            gameManager.all().map(game => gameManager.restartGame(game.id))
        )
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    /**
     * @api {post} /admin/games/:game/restart Restart game
     * @apiVersion 0.0.1
     * @apiGroup Admin
     *
     * @apiExample {json} Request:
     *      POST /admin/games/1/restart
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     */
    router.post('/games/:gameId/restart', (request, response, next) => {
        const gameId = request.params.gameId;

        gameManager.restartGame(gameId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};
