const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "payment_limit";
const tableFields = {
    value: "value"
}

exports.getValue = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1`, table);

    try {
        // one: trả về 1 kết quả
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/get", e);
    }
}
