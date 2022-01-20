const schema = 'public';
const pgp = require('pg-promise')({
    capSQL: true,
});
const { db } = require('../db/db_config.js');

const tableName = "quarantine_location_record";
const tableFields = {
    id: 'id',   // Primary Key
    user_id: 'user_id',
    location_id: 'location_id',
    record_time: 'record_time'
}

exports.add = async (entity) => {
    const table = new pgp.helpers.TableName({ table: tableName, schema: schema });
    const queryStr = pgp.helpers.insert(entity, null, table) + ' RETURNING *';
    try {
        const res = await db.one(queryStr);
        return res;
    } catch (error) {
        console.log('Error quarantineLocationModel/add: ', error);
        throw error;
    }
}