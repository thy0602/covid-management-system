const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

exports.getAll = async (tableName) => {
    console.log(tableName);
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/getAll", e);
    }
};

exports.getChild = async (tableNameChild, tableNameParent, name) => {

    // const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT d.id, d.name FROM public.${tableNameChild} d
    WHERE d.${tableNameParent}_id = ${name}`);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/getChild", e);
    }
};