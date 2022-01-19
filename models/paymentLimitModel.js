const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "payment_limit";

exports.updatePaymentLimit = async (value) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`UPDATE $1 SET value = ${value} RETURNING *`, table);

    console.log(queryStr);

    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log("Error packModel/updatePaymentLimit: ", error);
        throw error;
    }
}

exports.getPaymentLimit = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT value FROM $1;`, table);

    console.log(queryStr);

    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log("Error packModel/updatePaymentLimit: ", error);
        throw error;
    }
}
