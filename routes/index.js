var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    //res.send("Olá Node JS! Agora com Nodemon!");

    var user = {
        nome: "Douglas"
    }

    res.status(200).json(user);
});

module.exports = router;
