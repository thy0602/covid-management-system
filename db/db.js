const pgp = require("pg-promise")({
  capSQL: true,
});

const schema = "public";

const { connection } = require("./db_config.js");

const db = pgp(connection);

// Get all records in a table
exports.getAll = async (tableName) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format("SELECT * FROM $1", table);

  try {
    const res = await db.any(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/load", e);
  }
};

exports.getAllOrderByField = async (
  tableName,
  fieldname,
  optionSort = "ASC"
) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format(
    `SELECT * FROM $1 ORDER BY "${fieldname}" ${optionSort}`,
    table
  );

  try {
    const res = await db.any(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/load", e);
  }
};

// get records filterd by a fieldname
exports.getByAField = async (tableName, fieldname, value) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format(
    `SELECT * FROM $1 WHERE "${fieldname}"='${value}'`,
    table
  );

  try {
    // one: trả về 1 kết quả
    const res = await db.any(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/get", e);
  }
};

// create a record in a table
exports.create = async (tableName, entity) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });

  const queryStr = pgp.helpers.insert(entity, null, table) + " RETURNING *";

  try {
    // one: trả về 1 kết quả
    const res = await db.one(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/create", e.message);
  }
};

// update a record in a table fileter by a fieldname
exports.update = async (tableName, fieldname, filterValue, entity, columns) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const condition = pgp.as.format(` WHERE "${fieldname}"='${filterValue}'`);

  const queryStr =
    pgp.helpers.update(entity, columns, table) + condition + " RETURNING *";
  console.log(queryStr);

  try {
    // one: trả về 1 kết quả
    const res = await db.one(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/update", e);
  }
};

exports.createTransaction = async (transaction, user) => {
  const table = new pgp.helpers.TableName({
    table: "transaction_record",
    schema: schema,
  });
  const queryStr =
    pgp.helpers.insert(transaction, null, table) + " RETURNING *";

  try {
    const data = await db.tx("update-user", async (t) => {
      await t.none("UPDATE account SET balance = $1 WHERE username = $2", [
        user.balance,
        user.username,
      ]);
      return await t.one(queryStr);
    });

    // success, COMMIT was executed
    return { isCreated: true, data: data };
  } catch (err) {
    // failure, ROLLBACK was executed
    return { isCreated: false, data: err };
  }
};

exports.finalizeTransaction = async (transaction, admin) => {
  try {
    await db.tx("finalize-transaction", async (t) => {
      await t.none(
        "UPDATE transaction_record SET status = $1 WHERE transaction_id = $2",
        ["D", transaction.transaction_id]
      );
      await t.none("UPDATE admin SET balance = $1 WHERE username = $2", [
        admin.balance,
        admin.username,
      ]);
    });
    return { isFinalized: true, message: "" };
  } catch (err) {
    return { isFinalized: false, message: err };
  }
};

exports.delete = async (tableName, fieldname, value) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format(
    `DELETE FROM $1 WHERE "${fieldname}"='${value}'`,
    table
  );

  try {
    const res = await db.any(queryStr);
    return true;
  } catch (e) {
    console.log("Error db/delete", e);
  }
};
