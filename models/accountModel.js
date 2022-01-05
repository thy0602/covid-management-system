const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "account";
const tableFields = {
    username: 'username',   // Primary Key
    password: 'password',
    role: 'role',
    is_deleted: 'is_deleted'
}

exports.getAllCases = async () => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT COUNT(*) FROM TABLE WHERE DATE BETWEEN ${new Date().getDate() + ' 00:00:00'} AND ${new Date().getDate() + ' 23:59:59'}`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
};