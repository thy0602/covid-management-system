const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "order_detail";
const tableFields = {
    order_id: 'order_id',   // Primary Key
    pack_id: 'pack_id',     // Primary Key
    product_id: 'product_id',   // Primary Key
    quantity: 'quantity',
    bought_price: 'bought_price'
}

exports.countAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT COUNT(*) FROM $1`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error orderDetailModel/countAll: ", e);
    }
}

