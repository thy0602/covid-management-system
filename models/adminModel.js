const db = require("../db/db");
const tableName = "admin";
const PKFieldName = "username", pwdFieldName = "password", balFieldName = "balance";

exports.getAll = async () => {
    const res = await db.getAll(tableName);
    return res[0];
}


