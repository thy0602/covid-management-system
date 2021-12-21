const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const accountModel = require('../models/accountModel');
const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');

module.exports = app => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },
        async (username, password, done) => {
            let user;
            try {
                user = await accountModel.getByUsername(username);
                if (user.length == 0) {
                    user = await adminModel.getByUsername(username);
                }
                const pwd = await bcrypt.compare(password, user[0].password);
                if (!pwd) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    })
                }
                return done(null, user[0]);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });
    passport.deserializeUser(async (user, done) => {
        try {
            let usertmp = await accountModel.getByUsername(user);
            if (usertmp.length == 0) {
                usertmp = await adminModel.getByUsername(user);
            }
            done(null, usertmp[0].username);
        } catch (error) {
            done(new Error('error'), null);
        }
    })

    app.use(passport.initialize());
    app.use(passport.session());
}