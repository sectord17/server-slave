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

app.debug = function (message) {
    if (process.env.DEBUG) {
        console.log(message);
    }
};

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require('./lib')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(null)
});

module.exports = app;