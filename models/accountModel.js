const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "account";
const tableFields = {
    username: 'username',   // Primary Key
    password: 'password',
    role: 'role',
    is_deleted: 'is_deleted'
}

exports.getAllCases = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT COUNT(*) FROM TABLE WHERE DATE BETWEEN ${new Date().getDate() + ' 00:00:00'} AND ${new Date().getDate() + ' 23:59:59'}`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
};

exports.getByUsername = async (username) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(
        `SELECT * FROM $1 WHERE "username"='${username}' AND "is_deleted" IS FALSE`,
        table
    );

    try {
        // one: trả về 1 kết quả
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/get", e);
    }
}

// generic way to skip NULL/undefined values for strings/boolean
function isSkipCol(col) {
    return {
        name: col,
        skip: function () {
            var val = this[col];
            return val === null || val === undefined;
        }
    };
}
// Creating a reusable ColumnSet for all updates:
var csGeneric = new pgp.helpers.ColumnSet([
    isSkipCol(tableFields.username),
    isSkipCol(tableFields.password),
    isSkipCol(tableFields.role),
    isSkipCol(tableFields.is_deleted)
], { table: tableName });


exports.update = async (PKvalue, entity) => {
    const queryStr = pgp.helpers.update(entity, csGeneric) + ` WHERE "username" = '${PKvalue}' RETURNING *`;
    const res = await db.one(queryStr);
    return res;
}