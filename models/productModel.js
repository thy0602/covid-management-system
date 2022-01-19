const schema = "public";
const pgp = require("pg-promise")({
  capSQL: true,
});
const { db } = require("../db/db_config.js");

const tableName = "product";
const tableFields = {
  id: "id", // Primary Key
  name: "name",
  unit: "unit",
  price: "price",
  is_deleted: "is_deleted"
};

// https://ubiq.co/database-blog/how-to-get-first-row-per-group-in-postgresql/
exports.getProductList = async () => {
    const queryStr = pgp.as.format(`SELECT * FROM 
                                (SELECT * FROM "product" WHERE "is_deleted" IS FALSE)
                                LEFT JOIN (SELECT * FROM (
                                    SELECT *,
                                    row_number() over (partition by "product_id") 
                                    as row_number
                                    FROM "product_image") temp WHERE row_number=1) pi
                                ON p."id" = pi."product_id";`);
    try {
        const res = await db.any(queryStr);
        return res;
      } catch (e) {
        console.log("Error getProductList product model", e);
      }
};

exports.getAllProductOrderBy = async (orderBy, ascending=true) => {
  const sortOption = ascending ? 'ASC' : 'DESC';
  const queryStr = pgp.as.format(`SELECT * FROM
                                (SELECT * FROM "product" WHERE "is_deleted" IS FALSE) p
                                LEFT JOIN (SELECT * FROM (
                                    SELECT *,
                                    row_number() over (partition by "product_id") 
                                    as row_number
                                    FROM "product_image") temp WHERE row_number=1) pi
                                ON p."id" = pi."product_id" ORDER BY ${orderBy} ${sortOption};`)

  try {
      const res = await db.any(queryStr);
      return res;
  } catch (e) {
      console.log("Error getAllProductOrderBy: ", e);
      // throw e;
  }
}

exports.getById = async (id) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.as.format(`SELECT * FROM $1 WHERE ${tableFields.id} = '${id}' 
                                    AND ${tableFields.is_deleted} IS FALSE;`, table);
    try {
        const res = await db.any(queryStr);
        return res[0];
    } catch (e) {
        console.log("Error db/load product/id:", e);
    }
}

// generic way to skip NULL/undefined values for strings/boolean
function isSkipCol(col) {
  return {
      name: col,
      skip: function () {
          var val = this[col];
          return val === null || val === undefined;
      }
  };
}

// generic way to skip NULL/undefined values for integers,
// while parsing the type correctly:
function isSkipIntCol(col) {
  return {
      name: col,
      skip: function () {
          var val = this[col];
          return val === null || val === undefined;
      },
      init: function () {
          return parseInt(this[col]);
      }
  };
}

// Creating a reusable ColumnSet for all updates:
var csGeneric = new pgp.helpers.ColumnSet([
  isSkipIntCol(tableFields.id),
  isSkipCol(tableFields.name),
  isSkipCol(tableFields.unit),
  isSkipIntCol(tableFields.price),
  isSkipCol(tableFields.is_deleted)
], {table: tableName});

exports.update = async (entity) => {
  const queryStr = pgp.helpers.update(entity, csGeneric) + ` WHERE ${tableFields.id} = ${entity.id} RETURNING *`;

  try {
    const res = await db.one(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/update", e.message);
  }
}

exports.create = async (entity) => {
  const table = new pgp.helpers.TableName({ table: tableName, schema: schema });

  const queryStr = pgp.helpers.insert(entity, null, table) + " RETURNING *";

  try {
    const res = await db.one(queryStr);
    return res;
  } catch (e) {
    console.log("Error db/create", e.message);
  }
}

exports.filterByPrice = async (price) => {
  const queryStr = pgp.as.format(`SELECT * FROM
                                (SELECT * FROM "product" WHERE "is_deleted" IS FALSE AND "price" <= ${price}) p
                                LEFT JOIN (SELECT * FROM (
                                    SELECT *,
                                    row_number() over (partition by "product_id") 
                                    as row_number
                                    FROM "product_image") temp WHERE row_number=1) pi
                                ON p."id" = pi."product_id" ORDER BY p."name" ASC;`)

  try {
    const res = await db.any(queryStr);
    return res;
  } catch (e) {
    console.log("Error product/filterByPrice", e.message);
  }
}
