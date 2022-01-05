const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
    res.render("product_list", {
        isNecessities: 1
    });
})

module.exports = router;