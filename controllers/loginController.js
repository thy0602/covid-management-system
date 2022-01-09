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
            return res.redirect('/account/register-password?id=' + id);
        }
        return res.redirect('/account/login-password?id=' + id);
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
    res.redirect('/account/login-id?status=true');
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


module.exports = router;
