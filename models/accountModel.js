const db = require("../db/db");
const tableName = "account";
const PKFieldName = "username",
  pwdFieldName = "password",
  balFieldName = "balance";

exports.getAll = async () => {
  const res = await db.getAll(tableName);
  return res;
};

exports.getByUsername = async (username) => {
  const res = await db.getByAField(tableName, PKFieldName, username);
  return res[0];
};

exports.create = async (entity) => {
  const res = await db.create(tableName, entity);
  return res;
};

// update a record in a table fileter by a fieldname
exports.update = async (tableName, fieldname, filterValue, entity) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const condition = pgp.as.format(` WHERE "${fieldname}"= '${filterValue}'`);

  const queryStr =
    pgp.helpers.update(entity, null, table) + condition + " RETURNING *";

  try {
    // one: trả về 1 kết quả
    const res = await db.one(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/update", e);
  }
};

exports.delete = async (PKvalue) => {
  const res = await db.delete(tableName, PKFieldName, PKvalue);
  return res;
};
