const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "pack";
const tableFields = {
    id: 'id',   // Primary Key
    name: 'name',
    quantity_limit: 'quantity_limit',
    time_limit_unit: 'time_limit_unit',
    is_deleted: 'is_deleted'
}

exports.getAll = async (includeDeletedPack=false) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    let queryStr = '';
    if (!includeDeletedPack) {
        queryStr = pgp.as.format(`SELECT * FROM $1 WHERE "${tableFields.is_deleted}"='False'
                    ORDER BY ${tableFields.id} ASC;`, table);
    } else {
        queryStr = pgp.as.format(`SELECT * FROM $1 ORDER BY ${tableFields.id} ASC;`, table)
    }
    
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error packModel/getAll: ", e);
        throw e;
    }
}

exports.getByPackId = async (packId, includeDeletedPack=false) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    let queryStr = '';
    if (!includeDeletedPack) {
        queryStr = pgp.as.format(`SELECT * FROM $1 WHERE "${tableFields.id}"='${packId}' AND "${tableFields.is_deleted}"='False';`, table);
    } else {
        queryStr = pgp.as.format(`SELECT * FROM $1 WHERE "${tableFields.id}"='${packId}';`, table);
    }

    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error packModel/getByPackId: ", e);
        throw e;
    }
}

exports.updateByPackId = async (packId, entity) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const condition = pgp.as.format(` WHERE "${tableFields.id}"='${packId}'`);
    const queryStr = pgp.helpers.update(entity, Object.keys(entity), table) + condition + ' RETURNING *';

    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log("Error packModel/updateByPackId: ", error);
        throw error;
    }
}

exports.add = async (entity) => {
    const table = new pgp.helpers.TableName({table: tableName, schema: schema});
    const queryStr = pgp.helpers.insert(entity, null, table) + ' RETURNING *';
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log('Error packModel/add: ', error);
        throw error;
    }
}