const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const salt = 10;
const accountModel = require('../../models/accountModel');

router.post('/', async (req, res) => {
    try {
        const password = req.body.password;
        const user = await accountModel.getByUsername(req.cookies.user);
        let is_valid = await bcrypt.compare(password, user.password);

        res.status(200).send({ message: "Success!", data: {username: req.cookies.user, is_authorized: is_valid, token: req.cookies.jwt } });
        // if (is_valid)
        //     res.status(200).send({ message: "Success!", data: req.cookies.user });
        // else
        //     res.status(401).send({ message: "Unauthorized!" });
    } catch (e) {
        res.status(500).send({ message: "Internal server error" });
    }
});

router.get('/', (req, res) => {
    if (!req.cookies.user)
        return res.redirect('/account/login-id');
    return res.status(200).send({ username: req.cookies.user });
})

module.exports = router;
