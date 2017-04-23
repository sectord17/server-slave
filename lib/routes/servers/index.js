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
    });

    // Join
    router.post('/:serverId/join', function (request, response) {
        // TODO: Request validation

        app.serverManager.assignPlayer(request.params.serverId, request.body.token);
    });

    return router;
};
