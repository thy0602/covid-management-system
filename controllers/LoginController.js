const accountModel = require('../models/accountModel');
const adminModel = require('../models/adminModel');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const salt = 10;
const passport = require('passport');
const { redirect } = require('express/lib/response');

router.post('/id', async (req, res) => {
    let id = req.body.id;
    //kiểm tra id có tồn tại trong database không
    const user = await accountModel.getByUsername(req.body.id);
    if (user.length > 0) {
        //nếu có user thì check xem có password chưa?
        if (!user[0].password) {
            //là null
            return res.redirect('/login/crpassword?id=' + id);
        }
        return res.redirect('/login/password?id=' + id);
    }
    //nếu không có user
    //trường hợp là admin
    const admin = await adminModel.getByUsername(req.body.id);
    if (admin.length > 0) {
        return res.redirect('/login/password?id=' + id);
    }
    return res.render('login_views/login_id', {
        layout: false,
        msg: () => 'login_partials/msg_id',
        color: '#ff835d',
        message: 'Account does not exist!'
    });
});

router.post('/password', async (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.send("error001");
        }
        if (!user) {
            return res.render('login_views/login_pw', {
                layout: false,
                id: req.body.id,
                msg: () => 'login_partials/msg_password',
                color: '#f3d97a',
                message: 'Passcode incorrect !'
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.render('login_views/login_pw', {
                    layout: false,
                    id: req.body.id,
                    msg: () => 'login_partials/msg_password',
                    color: '#f3d97a',
                    message: err
                });
            }
            console.log('login successful');
            return res.redirect('/');
        })
    })(req, res, next);
});

router.post('/crpassword', async (req, res) => {
    const pwhashed = await bcrypt.hash(req.body.confirm_password, salt);
    const user = {
        password: pwhashed,
        balance: null
    }
    const rs = await accountModel.update(req.body.id, user);
    res.redirect('/login/id?status=true');
    return;
});

router.get('/crpassword', (req, res) => {
    res.render('login_views/login_createpw', {
        layout: false,
        id: req.query.id,
        msg: () => 'empty'
    });
})

router.get('/password', (req, res) => {
    res.render('login_views/login_pw', {
        layout: false,
        id: req.query.id,
        msg: () => 'empty'
    });
});

router.get('/id', (req, res) => {
    if (req.user)
        return res.redirect('/');
    if (req.query.status == 'true') {
        return res.render('login_views/login_id', {
            layout: false,
            color: '#49c53f',
            message: 'Updated passcode successful!',
            msg: () => 'login_partials/msg_id'
        });
    }
    return res.render('login_views/login_id', {
        layout: false,
        msg: () => 'empty'
    });
});

router.get('/', (req, res) => {
    res.redirect('/login/id');
    return;
});

module.exports = router;