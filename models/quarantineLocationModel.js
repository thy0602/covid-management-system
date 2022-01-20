const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "quarantine_location";
const tableFields = {
    id: 'id',   // Primary Key
    name: 'name',
    capacity: 'capacity',
    occupancy: 'occupancy',
    is_deleted: 'is_deleted'
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE "is_deleted" IS FALSE`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error quarantineLocationModel/getAll: ", e);
        throw e;
    }
}

exports.getByLocationId = async (locationId) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE "${tableFields.id}"='${locationId}';`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log("Error quarantineLocationModel/getByLocationId: ", e);
        throw e;
    }
}

exports.updateByLocationId = async (locationId, entity) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const condition = pgp.as.format(` WHERE "${tableFields.id}"='${locationId}'`);
    const queryStr = pgp.helpers.update(entity, Object.keys(entity), table) + condition + ' RETURNING *';

    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log("Error packModel/updateByLocationId: ", error);
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
        console.log('Error quarantineLocationModel/add: ', error);
        throw error;
        console.log("Error quarantine_location/load getAll", e);
    }
}


exports.getById = async (id) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE "${tableFields.id}" = '${id}'`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error quarantine_location/load getAll", e);
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