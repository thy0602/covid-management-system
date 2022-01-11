const pgp = require('pg-promise')({
    capSQL: true,
});

const connection = {
    user: 'postgres',
    host: 'localhost',
    database: 'covid_management',
    password: 'postgres',
    port: 5432,
    max: 30,
}

exports.db = pgp(connection);