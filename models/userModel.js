const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "user";
const tableFields = {
    id: 'id',   // Primary Key
    name: 'name',
    year_of_birth: 'year_of_birth',
    address: 'address',
    max_basket: 'max_basket',
    basket_limit: 'basket_limit',
    username: 'username',
    current_status: 'current_status',
    current_location: "current_location"
}

exports.countAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT COUNT(*) FROM $1`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}

exports.countByStatus = async (status) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT COUNT(*) FROM $1 WHERE ${tableFields.current_status} = '${status}'`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}

exports.getById = async (id) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.id} = '${id}'`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load user:", e);
    }
}

exports.getByStatus = async (status) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.current_status} = '${status}'`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}
exports.getAllUserOrderBy = async (orderBy, ascending = true) => {
    const sortOption = ascending ? 'ASC' : 'DESC';
    const queryStr = pgp.as.format(`SELECT * FROM "user" p ORDER BY ${orderBy} ${sortOption};`)

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error getAllUserOrderBy: ", e);
        // throw e;
    }
}

exports.getAllUserWithLockedOrderBy = async (orderBy, ascending = true) => {
    const sortOption = ascending ? 'ASC' : 'DESC';
    const queryStr = pgp.as.format(`SELECT * FROM "user" p, "account" a
    WHERE a.username = p.username ORDER BY ${orderBy} ${sortOption};`)

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error getAllUserOrderBy: ", e);
        // throw e;
    }
}

exports.getAllRoleOrderBy = async (role) => {
    const queryStr = pgp.as.format(`SELECT p.username FROM "user" p, "account" a
                                    WHERE a.role = '${role}' and a.username = p.username ORDER BY p.username ASC;`)

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error getAllRoleOrderBy: ", e);
        // throw e;
    }
}

exports.update = async (data) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const condition = pgp.as.format(` WHERE "${tableFields.id}"='${data.id}'`);

    const queryStr =
        pgp.helpers.update(data, null, table) + condition + " RETURNING *";

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error update user: ", e);
        // throw e;
    }
}

exports.create = async (entity) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const qStr = pgp.helpers.insert(entity, null, table) + "RETURNING *";
    try {
        const res = await db.one(qStr);
        return res;
    } catch (error) {
        console.log('error db/usercreate:', error);
    }
};

exports.getByUsername = async (username) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(
        `SELECT * FROM $1 WHERE "username"='${username}'`,
        table
    );

    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/get", e);
    }
}
