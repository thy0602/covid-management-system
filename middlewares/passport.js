const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const accountModel = require('../models/accountModel');
const bcrypt = require('bcrypt');

module.exports = app => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },
        async (username, password, done) => {
            let user;
            try {
                console.log("username: ", username);
                user = await accountModel.getByUsername(username);

                const pwd = await bcrypt.compare(password, user.password);
                if (!pwd) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    })
                }
                return done(null, user);
            } catch (error) {
                console.log("Error passport:", error);
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
            done(null, usertmp.username);
        } catch (error) {
            done(new Error('error'), null);
        }
    })

    app.use(passport.initialize());
    app.use(passport.session());
}