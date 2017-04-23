module.exports = function (app) {
    require('./routes')(app);
    require('./cli')(app);
    app.serverManager = require('./server-manager')(app);
};