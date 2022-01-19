const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const salt = 10;
const paymentLimitModel = require('../../models/paymentLimitModel');

router.get('/', async (req, res) => {
    const response = await paymentLimitModel.getValue();
    res.status(200).send(response);
});

module.exports = router;
