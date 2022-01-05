const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
    res.render("user_list", {
        isPatient: 1
    });
})

module.exports = router;