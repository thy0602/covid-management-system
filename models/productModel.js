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
};

// https://ubiq.co/database-blog/how-to-get-first-row-per-group-in-postgresql/
exports.getProductList = async () => {
    const queryStr = pgp.as.format(`SELECT * FROM "product" p
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
