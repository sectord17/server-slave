module.exports = app => {
    // Authorize every request
    const token = process.env.TOKEN;
    app.use((request, response, next) => {
        if (token !== request.headers.authorization) {
            return response.sendStatus(401);
        }

        next();
    });

    app.use('/admin', require('./admin')(app.serverManager));
    app.use('/servers', require('./servers')(app.serverManager));
};