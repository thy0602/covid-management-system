const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "order";
const tableFields = {
    id: 'id',   // Primary Key
    user_id: 'user_id',
    ordered_at: 'ordered_at',
    paid_at: 'paid_at',
    total_price: 'total_price'
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
    const queryStr = pgp.as.format(`SELECT * FROM $1 ORDER BY ${tableFields.ordered_at} DESC`, table);
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

exports.getOrderHistory = async (user_id) => {
    const queryStr = pgp.as.format(`
        SELECT DISTINCT od."order_id", o."ordered_at", o."paid_at",
            o."total_price", o."user_id", od."pack_id", p."name"
        FROM (SELECT * FROM "order" WHERE "user_id" = ${user_id}) o
        JOIN "order_detail" od ON o."id" = od."order_id"
        JOIN "pack" p ON p."id" = od."pack_id"
        ORDER BY od."order_id";
    `)
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error getUnpaidOrder", e);
    }
}
