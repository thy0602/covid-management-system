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
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
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