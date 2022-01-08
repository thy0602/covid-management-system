const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "relate";
const tableFields = {
    user_id1: 'user_id1',   // Primary Key
    user_id2: 'user_id2',
}

exports.getById = async (id) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.user_id1} = '${id}'`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load relatedModel", e);
    }
}