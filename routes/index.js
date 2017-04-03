let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Yes, it really works, slave!');
});

module.exports = router;
