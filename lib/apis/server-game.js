const axios = require('axios');
const debug = require('debug')('sectord17-slave:server-game');
const BasicError = require('../errors/basic-error');

module.exports = class ServerGame {
    constructor(url) {
        this.url = url;
    }

    join() {
        return axios.post(this.url + '/join')
            .then(response => response.data.token)
            .catch(error => {
                const response = error.response;
                if (response && response.status === 403) {
                    throw new BasicError(response.data.code);
                }

                debug(error);
                throw error;
            });
    }
};