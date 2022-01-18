const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "order_detail";
const tableFields = {
    order_id: 'order_id',   // Primary Key
    pack_id: 'pack_id',     // Primary Key
    product_id: 'product_id',   // Primary Key
    quantity: 'quantity',
    bought_price: 'bought_price'
}

exports.countAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT COUNT(*) FROM $1`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error orderDetailModel/countAll: ", e);
    }
}

exports.getGroupByPack = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT count(${tableFields.quantity}),${tableFields.pack_id},sum(${tableFields.bought_price}) FROM $1 GROUP BY ${tableFields.pack_id}`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error orderDetailModel/getGroupByPack: ", e);
    }
}

exports.getGroupByProduct = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT count(${tableFields.quantity}),${tableFields.product_id},sum(${tableFields.bought_price}) FROM $1 GROUP BY ${tableFields.product_id}`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error orderDetailModel/getGroupByProduct: ", e);
    }
}

exports.getPackItemsByOrderIdAndPackId = async (order_id, pack_id) => {
    const queryStr = pgp.as.format(`
        SELECT p."id", p."name", od."bought_price" as price, p."unit", od."quantity"
        FROM "order_detail" od JOIN "product" p
        ON od."product_id" = p.id
        WHERE "order_id" = ${order_id} AND "pack_id" = ${pack_id};
    `);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error getPackItemsByOrderIdAndPackId: ", e);
    }
}

exports.create = async (entity) => {
    const table = new pgp.helpers.TableName({table: tableName, schema: schema});
    const queryStr = pgp.helpers.insert(entity, Object.values(tableFields), table) + ' RETURNING *';
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (error) {
        console.log('Error pack_itemsModel/add: ', error);
        throw error;
    }
}
