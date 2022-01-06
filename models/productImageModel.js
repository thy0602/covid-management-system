const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "product_image";
const tableFields = {
    product_id: 'product_id',
    url: 'url'
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 ORDER BY ${tableFields.product_id} ASC`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error productImages/getAll: ", e);
        // throw e;
    }
}

exports.getImagesByProductId = async (productId) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.product_id}='${productId}'`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error productImages/getImagesByProductId: ", e);
        // throw e;
    }
}