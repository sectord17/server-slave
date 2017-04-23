let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.send('Sector D-17 Slave');
});

module.exports = router;
