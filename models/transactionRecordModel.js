const db = require("../db/db");
const tableName = "transaction_record";
const PKFieldName = "id";

exports.getAllSortedByTime = async () => {
    const res = await db.getAllOrderByField(tableName, "createdAt", "DESC");
    return res;
}

// Can get record by id or username
exports.getByAField = async (fieldname, value) => {
    const res = await db.getByAField(tableName, fieldname, value);
    return res;
}

exports.create = async (entity) => {
    const res = await db.create(tableName, entity);
    return res;
}

exports.createTransaction = async (transaction, user) => {
    try{
        const res = await db.createTransaction(transaction, user);
        return res;
    } catch(err){
        throw err;
    }
}

exports.finalizeTransaction = async (transaction, admin) => {
    try{
        const res = await db.finalizeTransaction(transaction, admin);
        return res;
    } catch(err){
        throw err;
    }
}
