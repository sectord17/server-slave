const axios = require('axios');
const debug = require('debug')('sectord17:server-game');

module.exports = class ServerGame {
    constructor(url) {
        this.url = url;
    }

    join() {
        return new Promise(function (resolve, reject) {
            axios.post(this.url + '/join')
                .then(response => resolve(response.data.token))
                .catch(error => {
                    debug(error);
                    reject(error);
                });
        }.bind(this));
    }
};