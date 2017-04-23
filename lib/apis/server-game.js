let axios = require('axios');

module.exports = class ServerGame {
    constructor(url, app) {
        this.url = url;
        this.app = app;
    }

    assign(onAssign, onError) {
        axios.post(this.url + '/join')
            .then(response => {
                if (onAssign) {
                    onAssign(response.data);
                }
            })
            .catch(error => {
                this.app.debug(error);

                if (onError) {
                    onError(error);
                }
            });
    }
};