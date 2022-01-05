const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "order_pack";
const tableFields = {
    order_id: 'order_id',   // Primary Key
    product_id: 'pack_id',
    quantity: 'quantity',
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

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 ORDER BY ${tableFields.order_at} DESC`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}

exports.getAllGroupByPackId = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT SUM(${tableFields.quantity}) FROM $1 OP INNER JOIN pack P ON OP.pack_id = P.id GROUP BY OP.pack_id,OP.order_id,P.id,P.name;`, table);
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
        console.log("Error db/load", e);
    }
}