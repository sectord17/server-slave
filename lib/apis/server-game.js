let axios = require('axios');

module.exports = class ServerGame {
    constructor(url, app) {
        this.url = url;
        this.app = app;
    }

    assign() {
        return new Promise(function (resolve, reject) {
            axios.post(this.url + '/join')
                .then(response => resolve(response.data))
                .catch(error => {
                    this.app.debug(error);
                    reject(error);
                });
        }.bind(this));
    }
};