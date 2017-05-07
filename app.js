let process = require('process'),
    express = require('express'),
    env = require('node-env-file'),
    raven = require('raven'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    app = express();

const BasicError = require('./lib/errors/basic-error');
const ModelNotFoundError = require('./lib/errors/model-not-found-error');
const EndpointNotFoundError = require('./lib/errors/endpoint-not-found-error');

env(__dirname + '/.env');

if (process.env.SENTRY_DSN) {
    raven.config(process.env.SENTRY_DSN).install();
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require('./lib')(app);

app.use((req, res, next) => {
    next(new EndpointNotFoundError());
});

app.use((error, request, response, next) => {
    if (error instanceof EndpointNotFoundError) {
        return response.sendStatus(404);
    }

    if (error instanceof BasicError) {
        return response.status(403).send(error);
    }

    if (error instanceof ModelNotFoundError) {
        return response.sendStatus(404);
    }

    if (process.env.SENTRY_DSN) {
        raven.captureException(error);
    }

    response.sendStatus(500);
});

module.exports = app;