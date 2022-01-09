const accountModel = require('../models/accountModel');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const salt = 10;
const passport = require('passport');

router.post('/id', async (req, res) => {
    let id = req.body.id;
    //kiểm tra id có tồn tại trong database không
    const user = await accountModel.getByUsername(req.body.id);
    if (user) {
        //nếu có user thì check xem có password chưa?
        if (!user.password) {
            //là chưa tạo
            return res.redirect('./register-password?id=' + id);
        }
        return res.redirect('./login-password?id=' + id);
    }
    //nếu không có user
    return res.render('account/login_id', {
        layout: false,
        msg: () => 'login_partials/msg_id',
        color: '#ff835d',
        message: 'Account does not exist!'
    });
});

router.post('/password', async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.send("error001");
        }
        if (!user) {
            return res.render('account/login_pw', {
                layout: false,
                id: req.body.id,
                msg: () => 'login_partials/msg_password',
                color: '#f3d97a',
                message: 'Passcode incorrect !'
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.render('account/login_pw', {
                    layout: false,
                    id: req.body.id,
                    msg: () => 'login_partials/msg_password',
                    color: '#f3d97a',
                    message: err
                });
            }
            console.log('login successfully');
            res.cookie('user', user.username);
            return res.redirect('/dashboard');
        })
    })(req, res, next);
});


router.post('/crpassword', async (req, res) => {
    const pwhashed = await bcrypt.hash(req.body.confirm_password, salt);
    const user = {
        password: pwhashed
    }
    const rs = await accountModel.update(req.body.id, user);
    res.redirect('./login-id?status=true');
    return;
});

router.post('/rspassword', async (req, res) => {

    const userdb = await accountModel.getByUsername(req.cookies.user);
    console.log(userdb);
    let checkpw = await bcrypt.compare(req.body.current_password, userdb.password);
    if (!checkpw) {
        return res.render('account/login_resetpw', {
            layout: false,
            message: 'Current Passcode is wrong',
            color: '#FF7B7B',
            msg: () => 'login_partials/msg_password'
        });
    }
    const pwhashed = await bcrypt.hash(req.body.confirm_password, salt);
    const user = {
        password: pwhashed
    }
    const rs = await accountModel.update(req.cookies.user, user);
    res.redirect('/dashboard');
    return;
});

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
