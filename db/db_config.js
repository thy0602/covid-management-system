require('dotenv').config();

const pgp = require('pg-promise')({
    capSQL: true,
});

const isProduction = process.env.NODE_ENV === 'production';

const connection = {
    user: 'postgres',
    host: 'localhost',
    database: 'covid_management',
    password: 'postgres',
    port: 5432,
    max: 30,
}

exports.db = pgp(isProduction ? process.env.DATABASE_URL : connection);
