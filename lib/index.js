module.exports = function (app) {
    app.cli = require('./cli')();
    app.serverManager = require('./server-manager')();

    require('./routes')(app);
};