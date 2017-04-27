module.exports = function (app) {
    app.use('/servers', require('./servers')(app.serverManager));
};