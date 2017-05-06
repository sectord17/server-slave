module.exports = function (app) {
    app.use('/admin', require('./admin')(app.serverManager));
    app.use('/servers', require('./servers')(app.serverManager));
};