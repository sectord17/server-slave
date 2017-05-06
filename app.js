let process = require('process'),
    express = require('express'),
    env = require('node-env-file'),
    raven = require('raven'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    BasicError = require('./lib/errors/basic-error'),
    app = express();

env(__dirname + '/.env');

if (process.env.SENTRY_DSN) {
    raven.config(process.env.SENTRY_DSN).install();
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require('./lib')(app);

app.use((req, res, next) => {
    let err = new Error();
    err.status = 404;
    next(err);
});

app.use((error, request, response, next) => {
    if (error instanceof BasicError) {
        return response.status(403).send(error);
    }

    if (error.message === "model-not-found") {
        return response.sendStatus(404);
    }

    let status = error.status || 500;

    if (status === 500 && process.env.SENTRY_DSN) {
        raven.captureException(error);
    }

    response.sendStatus(status);
});

module.exports = app;