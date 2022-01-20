const express = require("express");
const router = express.Router();
const accountModel = require("../models/accountModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

router.use('/', async (req, res, next) => {
    next();
});

router.get('/login-id', async (req, res) => {

    const admin = await accountModel.getByUsername('admin');
    if (!admin) {
        await accountModel.create({
            username: 'admin',
            role: 'admin',
            is_deleted: false,
            is_locked: false
        });
        return res.render('account/login_createpw', {
            layout: false,
            id: 'admin',
            msg: () => 'login_partials/msg_id',
            message: 'Register passcode for Admin !',
            color: '#f3d97a'
        });
    }
    if (req.user || req.cookies.user)
        return res.redirect('/dashboard');

    if (req.query.status == 'true') {
        return res.render('account/login_id', {
            layout: false,
            color: '#49c53f',
            message: 'Updated passcode successfully!',
            msg: () => 'login_partials/msg_id'
        });
    }
    return res.render('account/login_id', {
        layout: false,
        msg: () => 'empty'
    });
});

router.get('/login-password', (req, res) => {
    if (req.user || req.cookies.user)
        return res.redirect('/dashboard');
    if (!req.query.id)
        return res.redirect('./login-id');

    res.render('account/login_pw', {
        layout: false,
        id: req.query.id,
        msg: () => 'empty'
    });
});

router.get('/logout', async (req, res, next) => {
    console.log(req.user);
    if (req.user)
        req.logOut();
    res.clearCookie("user");
    return res.redirect('./login-id');
});

router.get('/change-password', (req, res) => {
    if (req.cookies.user) {
        return res.render('account/login_resetpw', {
            layout: false,
            msg: () => 'empty'
        });
    }
    return res.redirect('/home');
})

router.get('/register-password', (req, res) => {
    if (req.user || req.cookies.user)
        return res.redirect('/dashboard');

    res.render('account/login_createpw', {
        layout: false,
        id: req.query.id,
        msg: () => 'empty'
    });
})

router.get('/notification', async (req, res) => {
    if (!req.cookies.user)
        return res.redirect('/dashboard');
    const temp = require('jsonwebtoken').decode(req.cookies.user, true).username;
    if (temp[0] == 'M' || temp == 'admin')
        return res.redirect('/dashboard');

    try {
        const user = await userModel.getByUsername(temp);
        console.log("USER: ", user);
        const orders = await orderModel.getUrgentOrders(user.id);
        res.status(200).send({ orders: orders });
    } catch (e) {
        res.status(200).send({ error: e });
    }
})

module.exports = router;
