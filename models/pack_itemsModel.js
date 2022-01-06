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

exports.getAllProductByPackId = async (packId) => {
    // const pack_items = new pgp.helpers.TableName({ table: tableName, schema: schema });
    // const product = new pgp.helpers.TableName({ table: 'product', schema: schema });
    const pack_items = 'pack_items';
    const product = 'product';
    const queryStr = pgp.as.format(`SELECT * FROM "${pack_items}" JOIN "${product}" 
    ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" WHERE ${tableFields.pack_id}='${packId}'`);

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAllByPackId: ", e);
        // throw e;
    }
}

exports.getAllProductByPackIdOrderBy = async (packId, orderBy, ascending=true) => {
    // const pack_items = new pgp.helpers.TableName({ table: tableName, schema: schema });
    // const product = new pgp.helpers.TableName({ table: 'product', schema: schema });
    const pack_items = 'pack_items';
    const product = 'product';
    const sortOption = ascending ? 'ASC' : 'DESC';
    const queryStr = pgp.as.format(`SELECT * FROM "${pack_items}" JOIN "${product}" 
    ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" WHERE ${tableFields.pack_id}='${packId}' ORDER BY ${orderBy} ${sortOption}`);

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAllByPackId: ", e);
        // throw e;
    }
}