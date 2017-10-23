const axios = require('axios');

module.exports = exports = class MasterSDK {
    constructor(url, token) {
        this.url = url;
        this.token = token;
    }

    /**
     * @param {Game} game
     */
    informGameShutdown(game) {
        return axios.post(this.url + `/info/games/${game.id}/shutdown`, {}, this._getHttpConfig());
    }

    _getHttpConfig() {
        return {
            headers: {
                'authorization': this.token
            }
        };
    }
};
