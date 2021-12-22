const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
    res.render("user/list", {
    });
})

router.get('/detail', function(req, res) {
    let id = 0;
    if(req && req.query){
        id = req.query.id;
    }
    res.render("user/detail", {
    });
})

router.get('/new', function(req, res) {
    res.render("user/new", {
    });
})


module.exports = router;