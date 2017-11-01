const express = require('express');
const transformGame = require('../../transformers/game-transformer');

module.exports = () => {
    const {gameManager} = include('/lib');
    const router = express.Router();

    /**
     * @api {get} /games Get list of games
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiExample {json} Request:
     *      GET /games
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      [
     *          {
     *              id: 1,
     *              name: 'Test',
     *              ip: '192.0.2.1',
     *              port: 8000,
     *              players_count: 1
     *          },
     *          {
     *              id: 2,
     *              name: 'Foobar',
     *              ip: '192.0.2.2',
     *              port: 8005,
     *              players_count: 8
     *          }
     *      ]
     */
    router.get('/', (request, response) => {
        const games = gameManager.all()
            .map(game => transformGame(game));

        response.send(games);
    });

    /**
     * @api {post} /games Create the game
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiParam {String} id Id of the game
     * @apiExample {json} Request:
     *      POST /games
     *      {
     *          id: 100
     *      }
     *
     * @apiSuccess {String} ip IP of the game
     * @apiSuccess {Integer} port Port of the game
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          ip: '155.155.155.155',
     *          port: 8001
     *      }
     */
    router.post('/', (request, response, next) => {
        // TODO: Request validation

        const id = parseInt(request.body.id);
        const name = request.body.name;

        gameManager.bootstrapGame(id, name)
            .then(game => response.send({
                ip: game.ip,
                port: game.gamePort
            }))
            .catch(error => next(error));
    });

    /**
     * @api {delete} /games/:gameId Delete the game
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiExample {json} Request:
     *      DELETE /games/1
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     */
    router.delete('/:gameId', (request, response, next) => {
        const gameId = parseInt(request.params.gameId);

        gameManager.shutdownGame(gameId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    /**
     * @api {post} /games/:gameId/decision Decide to join the game
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiExample {json} Request:
     *      POST /games/1/decision
     *
     * @apiSuccess {String} token Authorization token
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          token: '1111-1111-1111-1111',
     *      }
     */
    router.post('/:gameId/decision', (request, response, next) => {
        const gameId = parseInt(request.params.gameId);

        gameManager.makePlayerDecided(gameId)
            .then(token => response.send({token}))
            .catch(error => next(error));
    });

    return router;
};
