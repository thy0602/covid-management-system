const express = require("express");
const router = express.Router();

router.get('/login-id', (req, res) => {
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

module.exports = router;