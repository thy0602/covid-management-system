const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
    res.render("pack_list", {
        isPackage: 1
    });
})

module.exports = router;