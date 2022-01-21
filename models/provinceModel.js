const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "province";
const tableFields = {
    id: 'id',   // Primary Key
    name: 'name'
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load relatedModel", e);
    }
}

exports.getByProvinceId = async (id) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE "${tableFields.id}" = '${id}'`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load relatedModel", e);
    }
}
