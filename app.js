let process = require('process'),
    express = require('express'),
    env = require('node-env-file'),
    raven = require('raven'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
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

app.use((err, req, res, next) => {
    let status = err.status || 500;

    if (err.message === "model-not-found") {
        status = 404;
    }

    res.sendStatus(status);
});

module.exports = app;