const express = require("express");
const router = express.Router();

router.get('/location', (req, res) => {
    res.render('location/location');
})

module.exports = router;
