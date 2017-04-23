module.exports = function (app) {
    app.use('/', require('./homepage'));
    app.use('/servers', require('./servers')(app));
};