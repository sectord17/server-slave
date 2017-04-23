module.exports = function (app) {
    let express = require('express'),
        router = express.Router();

    // Store
    router.post('/', function (request, response) {
        // TODO: Request validation

        app.serverManager.bootstrapGameInstance(request.body.serverId);
    });

    // Destroy
    router.delete('/:serverId', function (request, response) {
        app.serverManager.destroyGameInstance(request.params.serverId);

        response.sendStatus(200);
    });

    // Join
    router.post('/:serverId/join', function (request, response) {
        app.serverManager.assignPlayer(request.params.serverId, data => {
            response.send({
                token: data.token
            })
        }, error => {
            response.sendStatus(500);
        });
    });

    return router;
};
