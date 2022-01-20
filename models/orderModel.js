const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "order";
const tableFields = {
    id: 'id',   // Primary Key
    user_id: 'user_id',
    ordered_at: 'ordered_at',
    paid_at: 'paid_at',
    total_price: 'total_price'
}

exports.countAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT COUNT(*) FROM $1`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}

exports.getAll = async () => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 ORDER BY ${tableFields.ordered_at} DESC`, table);
    try {
        const res = await db.any(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}

exports.getById = async (id) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.id} = '${id}'`, table);
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (e) {
        console.log("Error db/load", e);
    }
}

exports.getOrderHistory = async (user_id) => {
    const queryStr1 = pgp.as.format(`
        SELECT DISTINCT od."order_id", o."ordered_at", o."paid_at",
            o."total_price", o."user_id", od."pack_id", p."name"
        FROM (SELECT * FROM "order" WHERE "user_id" = ${user_id} AND "paid_at" IS NULL) o
        JOIN "order_detail" od ON o."id" = od."order_id"
        JOIN "pack" p ON p."id" = od."pack_id"
        ORDER BY o."ordered_at" DESC;
    `)

    const queryStr2 = pgp.as.format(`
        SELECT DISTINCT od."order_id", o."ordered_at", o."paid_at",
            o."total_price", o."user_id", od."pack_id", p."name"
        FROM (SELECT * FROM "order" WHERE "user_id" = ${user_id} AND "paid_at" IS NOT NULL) o
        JOIN "order_detail" od ON o."id" = od."order_id"
        JOIN "pack" p ON p."id" = od."pack_id"
        ORDER BY o."ordered_at" DESC;
    `)

    try {
        const arr1 = await db.any(queryStr1);
        const arr2 = await db.any(queryStr2);
        const res = arr1.concat(arr2); 
        return res;
    } catch (e) {
        console.log("Error getUnpaidOrder", e);
    }
}

exports.create = async (entity) => {
    const table = new pgp.helpers.TableName({table: tableName, schema: schema});
    const queryStr = pgp.helpers.insert(entity, null, table) + ' RETURNING *';
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log('Error packModel/add: ', error);
        throw error;
    }
}

exports.getTotalPriceByIds = async (ids) => {
    if (ids.length <= 0)
        return 0;
    const queryStr = pgp.as.format('SELECT SUM("total_price") FROM "order" WHERE "id" IN ($1:csv)', [ids]);

    try {
        const res = await db.one(queryStr);
        return res.sum;
    } catch (error) {
        console.log('Error orderModel/getTotalOrderByIds: ', error);
        throw error;
    }
}

exports.getUnpaidTotalPrice = async (user_id) => {
    const queryStr = pgp.as.format(`SELECT SUM("total_price") FROM "order" 
                                    WHERE "user_id" = ${user_id} AND "paid_at" is NULL`);

    try {
        const res = await db.one(queryStr);
        return res.sum;
    } catch (error) {
        console.log('Error orderModel/getTotalOrderByIds: ', error);
        throw error;
    }
}

exports.markPaid = async (ids) => {
    try {
        const time = new Date().toISOString();
            const updateData = ids.map((id) => { 
            return { id: id, paid_at: time } 
        });

        // declare your ColumnSet once, and then reuse it:
        const cs = new pgp.helpers.ColumnSet(['?id', {name: 'paid_at', mod: ':raw', init: ()=> 'NOW()'}],
                                             {table: tableName});
        
        // // generating the update query where it is needed:
        const update = pgp.helpers.update(updateData, cs) + ' WHERE v.id = t.id RETURNING *';
        
        const res = await db.any(update);
        return res;
    } catch (error) {
        console.log('Error orderModel/markPaid: ', error);
       
    }
}

exports.getUnpaidOrders = async () => {
    const queryStr = pgp.as.format(`SELECT u."name", o."id", o."user_id", o."ordered_at", o."total_price", o."is_urgent"
                                    FROM "order" o
                                    JOIN "user" u on o.user_id = u.id 
                                    WHERE "paid_at" is NULL ORDER BY "ordered_at" DESC`);

    try {
        const res = await db.any(queryStr);
        return res;
    } catch (error) {
        console.log('Error orderModel/getUnpaidOrders: ', error);
        throw error;
    }
}

exports.markIsUrgent = async (order_id) => {
    const queryStr = pgp.as.format(`UPDATE "order" SET "is_urgent" = TRUE WHERE "id" = ${order_id} RETURNING *`);

    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log('Error orderModel/getUnpaidOrders: ', error);
        throw error;
    }
}

exports.getUrgentOrders = async (user_id) => {
    const queryStr = pgp.as.format(`SELECT * FROM "order" WHERE "user_id" = ${user_id} 
                                    AND "paid_at" IS NULL AND "is_urgent" IS TRUE`);

    try {
        const res = await db.any(queryStr);
        console.log(res);
        return res;
    } catch (error) {
        console.log('Error orderModel/getUrgentOrder: ', error);
        throw error;
    }
}
