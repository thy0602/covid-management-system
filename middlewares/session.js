const session = require('express-session');

module.exports = app => {
    app.use(session({
        secret: 'radomstring',
        resave: false,
        saveUninitialized: true,
    }));
}