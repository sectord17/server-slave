module.exports = app => {
    // Authorize every request
    const token = process.env.TOKEN;
    app.use((request, response, next) => {
        if (token !== request.headers.authorization) {
            return response.sendStatus(401);
        }

        return next();
    });

    app.use('/admin', require('./admin')());
    app.use('/servers', require('./servers')());
};