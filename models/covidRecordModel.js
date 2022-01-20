const schema = "public";
const pgp = require("pg-promise")({
  capSQL: true,
});
const { db } = require("../db/db_config.js");

const tableName = "covid_record";
const tableFields = {
  id: "id", // Primary Key
  covid_status: "covid_status",
  record_time: "record_time",
  user_id: "user_id",
};

exports.getAll = async () => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });

  const queryStr = pgp.as.format(
    `SELECT * FROM $1 ORDER BY ${tableFields.record_time} DESC;`,
    table
  );
  try {
    const res = await db.any(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/load", e);
  }
};

exports.create = async (entity) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const qStr = pgp.helpers.insert(entity, null, table) + "RETURNING *";
  try {
      const res = await db.one(qStr);
      return res;
  } catch (error) {
      console.log('error covidRecordModel/create:', error);
  }
};

exports.getById = async (id) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format(
    `SELECT * FROM $1 WHERE ${tableFields.user_id} = '${id}'`,
    table
  );
  try {
    const res = await db.any(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/load covidRecord: ", e);
  }
};

exports.getTodayAllCases = async () => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const todayStart =
      new Date().toLocaleDateString().replace("/", "-").replace("/", "-") +
      " 00:00:00",
    todayEnd =
      new Date().toLocaleDateString().replace("/", "-").replace("/", "-") +
      " 23:59:59";
  const queryStr = pgp.as.format(
    `SELECT COUNT(*) FROM $1 WHERE "${tableFields.record_time}" BETWEEN '${todayStart}' AND '${todayEnd}'`,
    table
  );
  try {
    const res = await db.any(queryStr);
    if (res) {
      return res[0].count;
    } else {
      return 0;
    }
  } catch (e) {
    console.log("Error db/load", e);
  }
};

exports.getTodaySpecificCase = async (type) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const todayStart =
      new Date().toLocaleDateString().replace("/", "-").replace("/", "-") +
      " 00:00:00",
    todayEnd =
      new Date().toLocaleDateString().replace("/", "-").replace("/", "-") +
      " 23:59:59";
  const queryStr = pgp.as.format(
    `SELECT COUNT(*) FROM $1 WHERE "${tableFields.record_time}" BETWEEN '${todayStart}' AND '${todayEnd}', "${tableFields.covid_status} = ${type}`,
    table
  );
  try {
    const res = await db.any(queryStr);
    if (res) {
      return res[0].count;
    } else {
      return 0;
    }
  } catch (e) {
    console.log("Error db/load", e);
  }
};

exports.getStatusFromDate = async (startDate,status) => {
  const formattedStartDate = new Date(startDate).toLocaleDateString().replace("/", "-").replace("/", "-") + " 00:00:00";
  const todayEnd = new Date().toLocaleDateString().replace("/", "-").replace("/", "-") + " 23:59:59";
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format(
    `SELECT * FROM $1 WHERE "${tableFields.covid_status}" = '${status}' AND "${tableFields.record_time}" BETWEEN '${formattedStartDate}' AND '${todayEnd}'`,
    table
  );
  try {
    const res = await db.any(queryStr);
    if (res) {
      return res;
    } else {
      return 0;
    }
  } catch (e) {
    console.log("Error db/getStatusFromDate", e);
  }
}

exports.getAllFromDate = async (startDate) => {
  const formattedStartDate = new Date(startDate).toLocaleDateString().replace("/", "-").replace("/", "-") +
  " 00:00:00";
  const todayEnd =
      new Date().toLocaleDateString().replace("/", "-").replace("/", "-") +
      " 23:59:59";
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format(
    `SELECT * FROM $1 WHERE "${tableFields.record_time}" BETWEEN '${formattedStartDate}' AND '${todayEnd}'`,
    table
  );
  try {
    const res = await db.any(queryStr);
    if (res) {
      return res;
    } else {
      return 0;
    }
  } catch (e) {
    console.log("Error db/getAllFromDate", e);
  }
}

exports.getCasesFromDate = async (from,to) => {
  const formattedStartDate = new Date(from).toLocaleDateString().replace("/", "-").replace("/", "-") +
  " 00:00:00";
  const formattedEndDate =
      new Date(to).toLocaleDateString().replace("/", "-").replace("/", "-") +
      " 23:59:59";
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
  const queryStr = pgp.as.format(
    `SELECT * FROM $1 WHERE "${tableFields.record_time}" BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`,
    table
  );
  try {
    const res = await db.any(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/load", e);
  }
};

