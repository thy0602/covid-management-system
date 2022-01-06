const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "pack_items";
const tableFields = {
    pack_id: 'pack_id',   // Primary Key
    product_id: 'product_id',
    quantity: 'quantity',
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 ORDER BY ${tableFields.pack_id} ASC ${tableFields.product_id} ASC`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAll: ", e);
        // throw e;
    }
}

exports.getAllByPackId = async (packId) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.pack_id}='${packId}' ORDER BY ${tableFields.product_id} ASC`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAllByPackId: ", e);
        // throw e;
    }
}