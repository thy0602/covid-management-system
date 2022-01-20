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

exports.getById_1 = async (id) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.user_id1} = '${id}'`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load relatedModel", e);
    }
}
exports.getById_2 = async (id) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.user_id2} = '${id}'`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load relatedModel", e);
    }
}


exports.create = async (entity) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const qStr = pgp.helpers.insert(entity, null, table) + "RETURNING *";
    try {
        const res = await db.one(qStr);
        return res;
    } catch (error) {
        console.log('error db/usercreate:', error);
    }
};

exports.delete = async (entity) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const qStr = pgp.as.format(`DELETE FROM $1 WHERE ${tableFields.user_id1} = '${entity.user_id1}' AND ${tableFields.user_id2} = '${entity.user_id2}'`, table);
    try {
        const res = await db.any(qStr);
        return res;
    } catch (error) {
        console.log('error db/usercreate:', error);
    }
};

