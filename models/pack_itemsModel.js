const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "pack_items";
const tableFields = {
    pack_id: 'pack_id',   // Primary Key
    product_id: 'product_id',
    quantity_limit: 'quantity_limit',
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 
                ORDER BY ${tableFields.pack_id} ASC ${tableFields.product_id} ASC`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAll: ", e);
        throw e;
    }
}

exports.getAllProductByPackId = async (packId, includeDeletedProduct=false) => {
    // const pack_items = new pgp.helpers.TableName({ table: tableName, schema: schema });
    // const product = new pgp.helpers.TableName({ table: 'product', schema: schema });
    const pack_items = tableName;
    const product = 'product';
    let queryStr = '';
    if (!includeDeletedProduct) {
        queryStr = pgp.as.format(`SELECT * FROM "${pack_items}"
                JOIN "${product}" ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" 
                WHERE ${tableFields.pack_id}='${packId}' AND "${product}"."is_deleted"='False';`);
    } else {
        queryStr = pgp.as.format(`SELECT * FROM "${pack_items}"
                JOIN "${product}" ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" 
                WHERE ${tableFields.pack_id}='${packId}';`);
    }

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAllByPackId: ", e);
        throw e;
    }
}

exports.getAllProductByPackIdOrderBy = async (packId, orderBy, ascending=true, includeDeletedProduct=false) => {
    // const pack_items = new pgp.helpers.TableName({ table: tableName, schema: schema });
    // const product = new pgp.helpers.TableName({ table: 'product', schema: schema });
    const pack_items = tableName;
    const product = 'product';
    const sortOption = ascending ? 'ASC' : 'DESC';
    let queryStr = '';
            
    if (!includeDeletedProduct) {
        queryStr = pgp.as.format(`SELECT * FROM "${pack_items}" 
                JOIN "${product}" ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" 
                WHERE ${tableFields.pack_id}='${packId}' AND "${product}"."is_deleted"='False'
                ORDER BY ${orderBy} ${sortOption}`);
    } else {
        queryStr = pgp.as.format(`SELECT * FROM "${pack_items}" 
                JOIN "${product}" ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" 
                WHERE ${tableFields.pack_id}='${packId}'
                ORDER BY ${orderBy} ${sortOption}`);
    }

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAllByPackId: ", e);
        throw e;
    }
}

exports.getAllProductNotInPack = async (packId, includeDeletedProduct=false) => {
    const pack_items = tableName;
    const product = 'product';
    let queryStr = '';
    if (!includeDeletedProduct) {
        let queryStr1 = pgp.as.format(`SELECT "${product}"."id" FROM "${pack_items}"
                JOIN "${product}" ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" 
                WHERE ${tableFields.pack_id}='${packId}' AND "${product}"."is_deleted"='False'`);
        
        queryStr = pgp.as.format(`SELECT * FROM "${product}" WHERE "id" NOT IN (${queryStr1}) AND "is_deleted"='False';`);
    } else {
        let queryStr1 = pgp.as.format(`SELECT "${product}"."id" FROM "${pack_items}"
                JOIN "${product}" ON "${pack_items}"."${tableFields.product_id}"="${product}"."id" 
                WHERE ${tableFields.pack_id}='${packId}' AND "${product}"."is_deleted"='False'`);

        queryStr = pgp.as.format(`SELECT * FROM "${product}" WHERE "id" NOT IN (${queryStr1});`);
    }

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/getAllProductNotInPack: ", e);
        throw e;
    }
}

exports.deleteAllByPackId = async (packId) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`DELETE FROM $1 WHERE "${tableFields.pack_id}"='${packId}'`, table) + " RETURNING *";

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error pack_itemsModel/deleteAllByPackId: ", e);
        throw e;
    }
}

exports.add = async (entity) => {
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