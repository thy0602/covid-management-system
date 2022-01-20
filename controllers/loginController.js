const accountModel = require('../models/accountModel');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const salt = 10;
const passport = require('passport');

//jwt
const jwt = require('jsonwebtoken');
const secretKey = 'ThisIsASecretKey';

const setAuthToken = (res, user) => {
    const expirationSeconds = 60 * 60 * 24 * 7; // one week
    const cookieExpiration = Date.now() + expirationSeconds * 1000;

    console.log(user);
    const payload = {
        exp: cookieExpiration,
        username: user.username,
    };

    const token = jwt.sign(JSON.stringify(payload), secretKey, {
        algorithm: "HS256",
    });
    console.log(token);
    res.cookie('user', user.username);

    res.cookie("jwt", token, {
        expires: new Date(cookieExpiration),
        httpOnly: true,
    });

    return res.redirect('/dashboard');
};

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
            return setAuthToken(res, user);
        })
    })(req, res, next);
});

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

// router.post('/password', async (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//         if (err) {
//             return res.send("error001");
//         }
//         if (!user) {
//             return res.render('account/login_pw', {
//                 layout: false,
//                 id: req.body.id,
//                 msg: () => 'login_partials/msg_password',
//                 color: '#f3d97a',
//                 message: 'Passcode incorrect !'
//             });
//         }
//         req.logIn(user, function (err) {
//             if (err) {
//                 return res.render('account/login_pw', {
//                     layout: false,
//                     id: req.body.id,
//                     msg: () => 'login_partials/msg_password',
//                     color: '#f3d97a',
//                     message: err
//                 });
//             }
//             console.log('login successfully');
//             res.cookie('user', user.username);
//             return res.redirect('/dashboard');
//         })
//     })(req, res, next);
// });


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
    let temp = require('jsonwebtoken').decode(req.cookies.user, true).username;
    const userdb = await accountModel.getByUsername(temp);
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
    const rs = await accountModel.update(temp, user);
    res.redirect('/dashboard');
    return;
});


module.exports = router;
