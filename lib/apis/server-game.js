const axios = require('axios');
const debug = require('debug')('sectord17:server-game');

module.exports = class ServerGame {
    constructor(url) {
        this.url = url;
    }

    join() {
        return axios.post(this.url + '/join')
            .then(response => response.data.token)
            .catch(error => {
                debug(error);
                throw error;
            });
    }
};