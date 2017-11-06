const axios = require('axios');
const debug = require('debug')('sectord17-slave:game-sdk');
const BasicError = include('/src/errors/basic-error');

module.exports = exports = class GameSDK {
    constructor(ip, httpPort, token, childProcess) {
        this.ip = ip;
        this.httpPort = httpPort;
        this.token = token;
        this.childProcess = childProcess;
        this.url = 'http://' + ip + ':' + httpPort;
    }

    decide() {
        return axios.post(this.url + '/decision', {}, this._getHttpConfig())
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

    shutdown() {
        return axios.post(this.url + '/shutdown', {}, this._getHttpConfig());
    }

    _getHttpConfig() {
        return {
            headers: {
                'authorization': this.token
            }
        };
    }
};
